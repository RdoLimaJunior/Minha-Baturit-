import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrediosPublicos, useTurismoItemById } from '../../hooks/useMockData';
import { PredioPublico, CategoriaPredioPublico, TurismoItem } from '../../types';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Card from '../ui/Card';
import { useToast } from '../ui/Toast';
import Modal from '../ui/Modal';
import { haversineDistance } from '../../utils/helpers';

declare var L: any;

const CATEGORIAS: CategoriaPredioPublico[] = [CategoriaPredioPublico.SAUDE, CategoriaPredioPublico.EDUCACAO, CategoriaPredioPublico.ASSISTENCIA, CategoriaPredioPublico.ADMINISTRACAO];
const CATEGORY_DETAILS: Record<CategoriaPredioPublico, { icon: string; color: string; bgColor: string }> = {
    [CategoriaPredioPublico.SAUDE]: { icon: 'local_hospital', color: 'text-rose-700', bgColor: 'bg-rose-100' },
    [CategoriaPredioPublico.EDUCACAO]: { icon: 'school', color: 'text-sky-700', bgColor: 'bg-sky-100' },
    [CategoriaPredioPublico.ASSISTENCIA]: { icon: 'people', color: 'text-violet-700', bgColor: 'bg-violet-100' },
    [CategoriaPredioPublico.ADMINISTRACAO]: { icon: 'corporate_fare', color: 'text-slate-700', bgColor: 'bg-slate-200' }
};

const PredioPublicoSkeletonItem: React.FC = () => (
    <Card className="!p-4 space-y-3 animate-pulse">
        <div className="flex justify-between items-start">
            <div className="w-3/4 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-5 bg-slate-200 rounded w-1/3"></div>
            </div>
            <div className="h-5 w-1/5 bg-slate-200 rounded-full"></div>
        </div>
        <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-full"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div className="flex items-center space-x-2 pt-3 border-t border-slate-100">
            <div className="h-9 bg-slate-200 rounded-lg w-full"></div>
            <div className="h-9 bg-slate-200 rounded-lg w-full"></div>
        </div>
    </Card>
);

const getCategoryIcon = (category: CategoriaPredioPublico, isSelected: boolean = false) => {
    const detail = CATEGORY_DETAILS[category] || { icon: 'location_on' };
    let bgColorClass = 'bg-slate-500';
    if(category === CategoriaPredioPublico.SAUDE) bgColorClass = 'bg-rose-500';
    if(category === CategoriaPredioPublico.EDUCACAO) bgColorClass = 'bg-sky-500';
    if(category === CategoriaPredioPublico.ASSISTENCIA) bgColorClass = 'bg-violet-500';
    if(category === CategoriaPredioPublico.ADMINISTRACAO) bgColorClass = 'bg-slate-500';

    const size = isSelected ? 48 : 36;
    const iconSize = isSelected ? '24px' : '18px';
    const ringClass = isSelected ? 'ring-4 ring-white' : 'ring-2 ring-white';
    const shadowClass = isSelected ? 'shadow-2xl scale-110' : 'shadow-lg';

    return L.divIcon({
        html: `<div class="p-2 ${bgColorClass} rounded-full ${shadowClass} ${ringClass} flex items-center justify-center transition-all duration-300" style="width: ${size}px; height: ${size}px;"><span class="material-icons-outlined text-white" style="font-size: ${iconSize};">${detail.icon}</span></div>`,
        className: 'bg-transparent border-0',
        iconSize: [size, size],
        iconAnchor: [size/2, size],
        popupAnchor: [0, -size]
    });
};

const getTurismoIcon = (isSelected: boolean = false) => {
    const size = isSelected ? 48 : 36;
    const iconSize = isSelected ? '24px' : '18px';
    const ringClass = isSelected ? 'ring-4 ring-white' : 'ring-2 ring-white';
    const shadowClass = isSelected ? 'shadow-2xl scale-110' : 'shadow-lg';

    return L.divIcon({
        html: `<div class="p-2 bg-amber-500 rounded-full ${shadowClass} ${ringClass} flex items-center justify-center transition-all duration-300" style="width: ${size}px; height: ${size}px;"><span class="material-icons-outlined text-white" style="font-size: ${iconSize};">tour</span></div>`,
        className: 'bg-transparent border-0',
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size]
    });
};

interface MapaServicosProps {
  predioId?: string;
  turismoId?: string;
}

function isPredioPublico(item: any): item is PredioPublico {
    return item && typeof item.categoria === 'string' && Object.values(CategoriaPredioPublico).includes(item.categoria as CategoriaPredioPublico);
}

const MapaServicos: React.FC<MapaServicosProps> = ({ predioId, turismoId }) => {
  const navigate = useNavigate();
  const { data: predios, loading: loadingPredios } = usePrediosPublicos();
  const { data: focusedTurismoItem, loading: loadingTurismo } = useTurismoItemById(turismoId || null);

  const [filtro, setFiltro] = useState<'Todos' | CategoriaPredioPublico | 'Proximos'>('Todos');
  const [selectedItem, setSelectedItem] = useState<PredioPublico | TurismoItem | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { addToast } = useToast();
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const markerRefs = useRef<Record<string, any>>({});
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const loading = loadingPredios || (turismoId ? loadingTurismo : false);
  
  useEffect(() => {
    if (selectedItem) {
        setCurrentImageIndex(0);
    }
  }, [selectedItem]);

  const prediosFiltrados = useMemo(() => {
    if (!predios) return [];
    if (filtro === 'Todos' || filtro === 'Proximos') return predios;
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
    if (filtro === 'Proximos' && userLocation) {
        enriched.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }
    return enriched;
  }, [prediosFiltrados, userLocation, filtro]);

  const handleProgrammaticFocus = useCallback((item: PredioPublico | TurismoItem) => {
    mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([item.localizacao.latitude, item.localizacao.longitude], 17);
    }
    setSelectedMarkerId(item.id);
    const marker = markerRefs.current[item.id];
    if (marker) {
        setTimeout(() => marker.openPopup(), 400);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => console.warn(`Error getting user location: ${error.message}`)
      );
    }
  }, []);

  useEffect(() => {
    if (!loading && mapContainerRef.current && !mapInstanceRef.current && (predios || focusedTurismoItem)) {
      const map = L.map(mapContainerRef.current).setView([-4.332, -38.880], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }
  }, [loading, predios, focusedTurismoItem]);
  
  useEffect(() => {
    if (mapInstanceRef.current && markersLayerRef.current) {
      const markersLayer = markersLayerRef.current;
      markersLayer.clearLayers();
      markerRefs.current = {};

      const itemsToDisplay: (PredioPublico | TurismoItem)[] = [...prediosFiltrados];
      if (focusedTurismoItem && !itemsToDisplay.some(i => i.id === focusedTurismoItem.id)) {
        itemsToDisplay.push(focusedTurismoItem);
      }
      
      itemsToDisplay.forEach(item => {
        const icon = isPredioPublico(item) ? getCategoryIcon(item.categoria) : getTurismoIcon();
        const popupContent = `
          <div class="font-sans font-bold text-center">
              ${item.nome}
          </div>
        `;
        const marker = L.marker([item.localizacao.latitude, item.localizacao.longitude], { icon })
         .addTo(markersLayer)
         .bindPopup(popupContent, { closeButton: false })
         .on('click', () => {
            setSelectedMarkerId(item.id);
            setSelectedItem(item);
         });
        markerRefs.current[item.id] = marker;
      });
    }
  }, [prediosFiltrados, focusedTurismoItem, setSelectedItem]);

  useEffect(() => {
      if (predioId && predios) {
          const itemToFocus = predios.find(p => p.id === predioId);
          if (itemToFocus) setTimeout(() => handleProgrammaticFocus(itemToFocus), 300);
      } else if (turismoId && focusedTurismoItem) {
          setTimeout(() => handleProgrammaticFocus(focusedTurismoItem), 300);
      }
  }, [predioId, turismoId, predios, focusedTurismoItem, handleProgrammaticFocus]);
  
  useEffect(() => {
    const markers = markerRefs.current;
    if (!markers) return;

    const allItems = [...(predios || []), ...(focusedTurismoItem ? [focusedTurismoItem] : [])];

    Object.keys(markers).forEach(itemId => {
        const marker = markers[itemId];
        const item = allItems.find(p => p.id === itemId);
        if (marker && item) {
            const isSelected = itemId === selectedMarkerId;
            const icon = isPredioPublico(item) ? getCategoryIcon(item.categoria, isSelected) : getTurismoIcon(isSelected);
            marker.setIcon(icon);
            marker.setZIndexOffset(isSelected ? 1000 : 0);
        }
    });
  }, [selectedMarkerId, predios, focusedTurismoItem]);

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
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigate('/')} variant="ghost" size="icon">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800">Mapa de Serviços</h2>
      </div>
      
      <Card className="!p-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <Button size="sm" onClick={() => setFiltro('Todos')} variant={filtro === 'Todos' ? 'primary' : 'ghost'} className="whitespace-nowrap">Todos</Button>
          <Button size="sm" onClick={() => setFiltro('Proximos')} variant={filtro === 'Proximos' ? 'primary' : 'ghost'} className="whitespace-nowrap" disabled={!userLocation}>Próximos</Button>
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
            <Button size="icon" onClick={handleCenterOnUser} className="absolute bottom-4 right-4 z-[1000] bg-white !text-slate-700 shadow-lg hover:!bg-slate-100" aria-label="Centralizar na minha localização">
              <Icon name="my_location" />
            </Button>
          </>
        )}
      </Card>

      <div className="space-y-3 pt-4">
        <h3 className="text-xl font-bold text-slate-800 px-1">Locais Encontrados</h3>
        {loading ? (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => <PredioPublicoSkeletonItem key={i} />)}
            </div>
        ) : prediosComDistancia.length > 0 ? (
            prediosComDistancia.map(predio => {
              const catDetails = CATEGORY_DETAILS[predio.categoria];
              return (
                <Card key={predio.id} className="!p-4 space-y-3" onClick={() => setSelectedItem(predio)}>
                    <div className="flex justify-between items-start">
                       <div>
                          <h3 className="font-bold text-lg text-slate-800">{predio.nome}</h3>
                          <div className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${catDetails.bgColor} ${catDetails.color} mt-1`}>
                            <Icon name={catDetails.icon} className="!text-sm" />
                            <span>{predio.categoria}</span>
                          </div>
                       </div>
                       <div className={`flex items-center space-x-1.5 text-xs font-semibold ${predio.isOpenNow ? 'text-emerald-600' : 'text-rose-600'}`}>
                          <div className={`w-2 h-2 rounded-full ${predio.isOpenNow ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                          <span>{predio.isOpenNow ? 'Aberto' : 'Fechado'}</span>
                       </div>
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                       <p className="flex items-center"><Icon name="location_on" className="text-base mr-2 text-slate-400" />{predio.endereco}</p>
                       {predio.distance !== null && <p className="flex items-center"><Icon name="near_me" className="text-base mr-2 text-slate-400" />{`~${predio.distance.toFixed(1)} km de distância`}</p>}
                    </div>
                    <div className="flex items-center space-x-2 pt-3 border-t border-slate-100">
                       <Button size="sm" onClick={() => setSelectedItem(predio)} variant="secondary" className="w-full">Detalhes</Button>
                       <Button size="sm" onClick={(e) => { e.stopPropagation(); handleProgrammaticFocus(predio); }} variant="primary" className="w-full">Ver no Mapa</Button>
                    </div>
                </Card>
              )
            })
        ) : (
            <Card><p className="text-center text-slate-600">Nenhum local encontrado para os filtros selecionados.</p></Card>
        )}
      </div>

      {selectedItem && (
        <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title={selectedItem.nome}>
            {(() => {
                const images = (isPredioPublico(selectedItem) ? selectedItem.imagens : selectedItem.imagens) || [];

                const handlePrevImage = () => setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
                const handleNextImage = () => setCurrentImageIndex(prev => (prev + 1) % images.length);
                
                const imageGallery = (
                    <>
                        {images.length > 0 && (
                            <div className="relative group w-full h-56 bg-slate-200">
                                <img src={images[currentImageIndex]} alt={`Foto de ${selectedItem.nome}`} className="w-full h-full object-cover" />
                                {images.length > 1 && (
                                    <>
                                        <Button size="icon" variant="secondary" onClick={handlePrevImage} className="!absolute left-2 top-1/2 -translate-y-1/2 !bg-black/40 !text-white !border-none opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" aria-label="Imagem anterior">
                                            <Icon name="chevron_left" />
                                        </Button>
                                        <Button size="icon" variant="secondary" onClick={handleNextImage} className="!absolute right-2 top-1/2 -translate-y-1/2 !bg-black/40 !text-white !border-none opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" aria-label="Próxima imagem">
                                            <Icon name="chevron_right" />
                                        </Button>
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5 p-1 bg-black/30 rounded-full">
                                            {images.map((_, index) => (
                                                <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full block ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`} aria-label={`Ir para imagem ${index + 1}`}></button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        {images.length > 1 && (
                            <div className="p-2 flex space-x-2 overflow-x-auto bg-slate-100">
                                {images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Miniatura ${index + 1}`}
                                        className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 flex-shrink-0 ${currentImageIndex === index ? 'border-indigo-500' : 'border-transparent'}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                );

                if (isPredioPublico(selectedItem)) {
                    return (
                        <>
                            {imageGallery}
                            <div className="p-6 space-y-4 text-slate-700">
                                <p className="text-base text-slate-600">{selectedItem.endereco}</p>
                                <div className="pt-4 border-t border-slate-200 space-y-2.5">
                                    <p className={`flex items-center font-semibold ${selectedItem.isOpenNow ? 'text-emerald-600' : 'text-rose-600'}`}><Icon name="fiber_manual_record" className="text-base mr-3" />{selectedItem.isOpenNow ? 'Aberto agora' : 'Fechado agora'}</p>
                                    {selectedItem.busyness && (<p className="flex items-center"><Icon name="show_chart" className="text-xl mr-2 text-slate-500" />{selectedItem.busyness}</p>)}
                                    <p className="flex items-center"><Icon name="schedule" className="text-xl mr-2 text-slate-500" />{selectedItem.horario}</p>
                                    <p className="flex items-center"><Icon name="phone" className="text-xl mr-2 text-slate-500" />{selectedItem.telefone}</p>
                                </div>
                                <div className="pt-4 border-t border-slate-200"><h5 className="font-bold text-slate-800 mb-2">Serviços oferecidos:</h5><ul className="list-disc list-inside space-y-1 pl-1">{selectedItem.servicos.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                                {selectedItem.profissionais && selectedItem.profissionais.length > 0 && (<div className="pt-4 border-t border-slate-200"><h5 className="font-bold text-slate-800 mb-3">Profissionais</h5><div className="space-y-3">{selectedItem.profissionais.map((prof, i) => (<div key={i} className="text-sm"><p className="font-semibold text-slate-700">{prof.nome}</p><p className="text-slate-600">{prof.cargo}</p><p className="text-xs text-slate-500 uppercase">{prof.cargaHoraria}</p></div>))}</div></div>)}
                                <div className="pt-4 mt-4 border-t border-slate-200 flex items-center flex-wrap gap-3"><Button iconLeft="call" onClick={() => window.location.href = `tel:${selectedItem.telefone.replace(/\D/g, '')}`} variant="secondary" className="bg-emerald-600 hover:bg-emerald-700 text-white">Ligar</Button><Button iconLeft="directions" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedItem.localizacao.latitude},${selectedItem.localizacao.longitude}`, '_blank')} variant="primary" className="bg-sky-600 hover:bg-sky-700 text-white">Google Maps</Button><Button iconLeft="navigation" onClick={() => window.open(`waze://?ll=${selectedItem.localizacao.latitude},${selectedItem.localizacao.longitude}&navigate=yes`, '_blank')} variant="secondary" className="bg-cyan-500 hover:bg-cyan-600 text-white">Waze</Button></div>
                            </div>
                        </>
                    );
                } else {
                    return (
                        <>
                            {imageGallery}
                            <div className="p-6 space-y-4 text-slate-700">
                                <p className="text-base text-slate-600">{selectedItem.descricao}</p>
                                <div className="pt-4 border-t border-slate-200 space-y-3">
                                    <p className="flex items-start"><Icon name="location_on" className="text-xl mr-2 text-slate-500 flex-shrink-0" /><span>{selectedItem.endereco}</span></p>
                                    {selectedItem.contato && <p className="flex items-center"><Icon name="phone" className="text-xl mr-2 text-slate-500" />{selectedItem.contato}</p>}
                                    {selectedItem.site && <p className="flex items-start"><Icon name="language" className="text-xl mr-2 text-slate-500 flex-shrink-0" /><a href={selectedItem.site} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-all">{selectedItem.site}</a></p>}
                                </div>
                                <div className="pt-4 mt-4 border-t border-slate-200 flex items-center flex-wrap gap-3"><Button iconLeft="directions" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedItem.localizacao.latitude},${selectedItem.localizacao.longitude}`, '_blank')} variant="primary">Rotas</Button>{selectedItem.contato && <Button iconLeft="call" onClick={() => window.location.href = `tel:${selectedItem.contato?.replace(/\D/g, '')}`} variant="secondary">Ligar</Button>}</div>
                            </div>
                        </>
                    );
                }
            })()}
        </Modal>
      )}
    </div>
  );
};

export default MapaServicos;