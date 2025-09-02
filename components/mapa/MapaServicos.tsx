import React, { useState, useEffect, useRef, useMemo } from 'react';
import { usePrediosPublicos } from '../../hooks/useMockData';
import { View, PredioPublico, CategoriaPredioPublico } from '../../types';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Card from '../ui/Card';
import { useToast } from '../ui/Toast';
import Modal from '../ui/Modal';
import { haversineDistance } from '../../utils/helpers';

declare var L: any;

const CATEGORIAS: CategoriaPredioPublico[] = ['Saúde', 'Educação', 'Assistência Social', 'Administração'];
const CATEGORY_DETAILS: Record<CategoriaPredioPublico, { icon: string; color: string; bgColor: string, darkBgColor: string, darkColor: string }> = {
    'Saúde': { icon: 'local_hospital', color: 'text-red-700', bgColor: 'bg-red-100', darkBgColor: 'dark:bg-red-900/50', darkColor: 'dark:text-red-300' },
    'Educação': { icon: 'school', color: 'text-blue-700', bgColor: 'bg-blue-100', darkBgColor: 'dark:bg-blue-900/50', darkColor: 'dark:text-blue-300' },
    'Assistência Social': { icon: 'people', color: 'text-purple-700', bgColor: 'bg-purple-100', darkBgColor: 'dark:bg-purple-900/50', darkColor: 'dark:text-purple-300' },
    'Administração': { icon: 'corporate_fare', color: 'text-gray-700', bgColor: 'bg-gray-200', darkBgColor: 'dark:bg-gray-600', darkColor: 'dark:text-gray-200' }
};

const PredioPublicoSkeletonItem: React.FC = () => (
    <Card className="!p-4 space-y-3 animate-pulse">
        <div className="flex justify-between items-start">
            <div className="w-3/4 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
            </div>
            <div className="h-5 w-1/5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>
        <div className="space-y-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
        <div className="flex items-center space-x-2 pt-3 border-t border-slate-100 dark:border-slate-700">
            <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
            <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
        </div>
    </Card>
);

const getCategoryIcon = (category: CategoriaPredioPublico) => {
    const detail = CATEGORY_DETAILS[category] || { icon: 'location_on', color: 'bg-gray-500' };
    const bgColorClass = detail.color.replace('text-', 'bg-').replace('-700', '-500');

    return L.divIcon({
        html: `<div class="p-2 ${bgColorClass} rounded-full shadow-lg ring-2 ring-white"><span class="material-icons-outlined text-white text-lg" style="font-size: 18px;">${detail.icon}</span></div>`,
        className: 'bg-transparent border-0',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });
};

interface MapaServicosProps {
  navigateTo: (view: View) => void;
}

const MapaServicos: React.FC<MapaServicosProps> = ({ navigateTo }) => {
  const { data: predios, loading } = usePrediosPublicos();
  const [filtro, setFiltro] = useState<'Todos' | CategoriaPredioPublico>('Todos');
  const [selectedPredio, setSelectedPredio] = useState<PredioPublico | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { addToast } = useToast();
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  const prediosFiltrados = useMemo(() => {
    if (!predios) return [];
    if (filtro === 'Todos') return predios;
    return predios.filter(p => p.categoria === filtro);
  }, [predios, filtro]);

  const prediosComDistancia = useMemo(() => {
    if (!prediosFiltrados) return [];
    const enriched = prediosFiltrados.map(p => ({
        ...p,
        distance: userLocation 
            ? haversineDistance(
                userLocation, 
                { lat: p.localizacao.latitude, lng: p.localizacao.longitude }
              ) 
            : null
    }));
    if (userLocation) {
        enriched.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }
    return enriched;
  }, [prediosFiltrados, userLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.warn(`Error getting user location: ${error.message}`);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!loading && mapContainerRef.current && !mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([-4.332, -38.880], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }
  }, [loading]);

  useEffect(() => {
    if (mapInstanceRef.current && markersLayerRef.current) {
      const map = mapInstanceRef.current;
      const markersLayer = markersLayerRef.current;
      
      markersLayer.clearLayers();

      if (prediosFiltrados.length > 0) {
        prediosFiltrados.forEach(predio => {
          const icon = getCategoryIcon(predio.categoria);
          L.marker([predio.localizacao.latitude, predio.localizacao.longitude], { icon })
           .addTo(markersLayer)
           .on('click', () => setSelectedPredio(predio));
        });

        if(prediosFiltrados.length > 1) {
            const bounds = L.latLngBounds(prediosFiltrados.map(p => [p.localizacao.latitude, p.localizacao.longitude]));
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (prediosFiltrados.length === 1) {
            map.setView([prediosFiltrados[0].localizacao.latitude, prediosFiltrados[0].localizacao.longitude], 16);
        }
      }
    }
  }, [prediosFiltrados]);

  const handleCenterOnUser = () => {
    if (!navigator.geolocation) {
      addToast('Geolocalização não é suportada pelo seu navegador.', 'error');
      return;
    }
    const map = mapInstanceRef.current;
    if (!map) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLatLng = L.latLng(latitude, longitude);
        setUserLocation({ lat: latitude, lng: longitude });

        map.flyTo(userLatLng, 16);

        if (userMarkerRef.current) userMarkerRef.current.remove();

        userMarkerRef.current = L.circleMarker(userLatLng, {
          radius: 8, fillColor: '#2563eb', color: '#ffffff', weight: 2, opacity: 1, fillOpacity: 0.9,
        }).addTo(map);
        addToast('Mapa centralizado na sua localização.', 'success');
      },
      (error) => addToast(error.code === 1 ? 'Você precisa permitir o acesso à localização.' : 'Não foi possível obter sua localização.', 'error')
    );
  };
  
  const showOnMap = (predio: PredioPublico) => {
    const map = mapInstanceRef.current;
    if (map) {
        map.flyTo([predio.localizacao.latitude, predio.localizacao.longitude], 17);
        setSelectedPredio(predio);
        mapContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigateTo('DASHBOARD')} variant="ghost" size="icon">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Mapa de Serviços</h2>
      </div>
      
      <Card className="!p-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <Button size="sm" onClick={() => setFiltro('Todos')} variant={filtro === 'Todos' ? 'primary' : 'ghost'} className="whitespace-nowrap">Todos</Button>
          {CATEGORIAS.map(cat => (
            <Button key={cat} size="sm" onClick={() => setFiltro(cat)} variant={filtro === cat ? 'primary' : 'ghost'} className="whitespace-nowrap">{cat}</Button>
          ))}
        </div>
      </Card>

      <Card className="!p-0 relative">
        {loading ? (
            <div className="h-96 flex items-center justify-center"><Spinner /></div>
        ) : (
          <>
            <div ref={mapContainerRef} className="h-96 w-full z-0" />
            <Button size="icon" onClick={handleCenterOnUser} className="absolute bottom-4 right-4 z-[1000] bg-white !text-slate-700 shadow-lg hover:!bg-slate-100 dark:bg-slate-700 dark:!text-slate-200 dark:hover:!bg-slate-600" aria-label="Centralizar na minha localização">
              <Icon name="my_location" />
            </Button>
          </>
        )}
      </Card>

      <div className="space-y-3 pt-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 px-1">Locais Encontrados</h3>
        {loading ? (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => <PredioPublicoSkeletonItem key={i} />)}
            </div>
        ) : prediosComDistancia.length > 0 ? (
            prediosComDistancia.map(predio => {
              const catDetails = CATEGORY_DETAILS[predio.categoria];
              return (
                <Card key={predio.id} className="!p-4 space-y-3">
                    <div className="flex justify-between items-start">
                       <div>
                          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{predio.nome}</h3>
                          <div className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${catDetails.bgColor} ${catDetails.color} ${catDetails.darkBgColor} ${catDetails.darkColor} mt-1`}>
                            <Icon name={catDetails.icon} className="!text-sm" />
                            <span>{predio.categoria}</span>
                          </div>
                       </div>
                       <div className={`flex items-center space-x-1.5 text-xs font-semibold ${predio.isOpenNow ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${predio.isOpenNow ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>{predio.isOpenNow ? 'Aberto' : 'Fechado'}</span>
                       </div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                       <p className="flex items-center"><Icon name="location_on" className="text-base mr-2 text-slate-400 dark:text-slate-500" />{predio.endereco}</p>
                       {predio.distance !== null && <p className="flex items-center"><Icon name="near_me" className="text-base mr-2 text-slate-400 dark:text-slate-500" />{`~${predio.distance.toFixed(1)} km de distância`}</p>}
                    </div>
                    <div className="flex items-center space-x-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                       <Button size="sm" onClick={() => setSelectedPredio(predio)} variant="secondary" className="w-full">Detalhes</Button>
                       <Button size="sm" onClick={() => showOnMap(predio)} variant="primary" className="w-full">Ver no Mapa</Button>
                    </div>
                </Card>
              )
            })
        ) : (
            <Card><p className="text-center text-slate-600 dark:text-slate-300">Nenhum local encontrado para os filtros selecionados.</p></Card>
        )}
      </div>


      {selectedPredio && (
        <Modal isOpen={!!selectedPredio} onClose={() => setSelectedPredio(null)} title={selectedPredio.nome}>
            <>
              {selectedPredio.imageUrl && (
                <img src={selectedPredio.imageUrl} alt={`Foto de ${selectedPredio.nome}`} className="w-full h-56 object-cover bg-slate-200 dark:bg-slate-700" />
              )}
              <div className="p-6 space-y-4 text-slate-700 dark:text-slate-200">
                  <p className="text-base text-slate-600 dark:text-slate-300">{selectedPredio.endereco}</p>
                  
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="space-y-2.5">
                          <p className={`flex items-center font-semibold ${selectedPredio.isOpenNow ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              <Icon name="fiber_manual_record" className="text-base mr-3" />
                              {selectedPredio.isOpenNow ? 'Aberto agora' : 'Fechado agora'}
                          </p>
                          {selectedPredio.busyness && (
                              <p className="flex items-center"><Icon name="show_chart" className="text-xl mr-2 text-slate-500 dark:text-slate-400" />{selectedPredio.busyness}</p>
                          )}
                          <p className="flex items-center"><Icon name="schedule" className="text-xl mr-2 text-slate-500 dark:text-slate-400" />{selectedPredio.horario}</p>
                          <p className="flex items-center"><Icon name="phone" className="text-xl mr-2 text-slate-500 dark:text-slate-400" />{selectedPredio.telefone}</p>
                      </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Serviços oferecidos:</h5>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                          {selectedPredio.servicos.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700 flex items-center flex-wrap gap-3">
                      <Button iconLeft="directions" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedPredio.localizacao.latitude},${selectedPredio.localizacao.longitude}`, '_blank')} variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white">Google Maps</Button>
                      <Button iconLeft="navigation" onClick={() => window.open(`waze://?ll=${selectedPredio.localizacao.latitude},${selectedPredio.localizacao.longitude}&navigate=yes`, '_blank')} variant="secondary" className="bg-sky-500 hover:bg-sky-600 text-white">Waze</Button>
                  </div>
              </div>
            </>
        </Modal>
      )}
    </div>
  );
};

export default MapaServicos;