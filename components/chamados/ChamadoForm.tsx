
import React, { useState } from 'react';
// FIX: Import 'CategoriaReclamacao' and alias it as 'CategoriaChamado' to fix the missing type error.
import { CategoriaReclamacao as CategoriaChamado } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import { BAIRROS_BATURITE } from '../../constants';
import { useToast } from '../ui/Toast';

interface ChamadoFormProps {
    goBack: () => void;
}

const ChamadoForm: React.FC<ChamadoFormProps> = ({ goBack }) => {
    const [categoria, setCategoria] = useState<CategoriaChamado | ''>('');
    const [bairro, setBairro] = useState<string>('');
    const [descricao, setDescricao] = useState('');
    const [foto, setFoto] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const [localizacao, setLocalizacao] = useState<{ lat: number, lng: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFoto(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    const handleGetLocation = () => {
        // Simulating geolocation fetch
        setLocalizacao({ lat: -4.333, lng: -38.881 });
        addToast('Localização obtida com sucesso!', 'success');
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!categoria || !descricao || !bairro) {
            addToast('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            console.log({ categoria, descricao, foto, localizacao, bairro });
            setIsSubmitting(false);
            addToast('Chamado aberto com sucesso!', 'success');
            goBack();
        }, 1500);
    };

    return (
        <div className="space-y-4">
            <Button onClick={goBack} variant="ghost" iconLeft="arrow_back">Voltar</Button>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">Novo Chamado</h2>
                    
                    <div>
                        <label htmlFor="categoria" className="block text-sm font-medium text-slate-700 mb-1">Categoria *</label>
                        <select
                            id="categoria"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value as CategoriaChamado)}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600"
                        >
                            <option value="" disabled>Selecione uma categoria</option>
                            {/* FIX: With the correct type imported, mapping over Object.values(CategoriaChamado) now works as expected. */}
                            {Object.values(CategoriaChamado).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="bairro" className="block text-sm font-medium text-slate-700 mb-1">Bairro *</label>
                        <select
                            id="bairro"
                            value={bairro}
                            onChange={(e) => setBairro(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600"
                        >
                            <option value="" disabled>Selecione seu bairro</option>
                            {BAIRROS_BATURITE.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="descricao" className="block text-sm font-medium text-slate-700 mb-1">Descrição *</label>
                        <textarea
                            id="descricao"
                            rows={4}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600"
                            placeholder="Descreva o problema com o máximo de detalhes."
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Foto (Opcional)</label>
                        <label htmlFor="foto-upload" className="w-full flex items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-md cursor-pointer hover:bg-slate-50">
                            <div className="text-center">
                                <Icon name="photo_camera" className="mx-auto text-4xl text-slate-400" />
                                <span className="mt-2 block text-sm text-slate-600">Clique para enviar uma foto</span>
                            </div>
                        </label>
                        <input id="foto-upload" type="file" className="sr-only" accept="image/*" onChange={handleFotoChange} />
                        {fotoPreview && <img src={fotoPreview} alt="Preview" className="mt-2 rounded-md w-32 h-32 object-cover" />}
                    </div>

                    <div className="space-y-2">
                         <label className="block text-sm font-medium text-slate-700">Localização</label>
                        <Button type="button" variant="secondary" onClick={handleGetLocation} iconLeft="my_location" className="w-full">
                           Usar minha localização atual
                        </Button>
                        {localizacao && (
                            <div className="text-sm text-green-600 flex items-center justify-center">
                                <Icon name="check_circle" className="text-lg mr-1" />
                                Localização capturada!
                            </div>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Abrir Chamado'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default ChamadoForm;