

import React, { useState } from 'react';
import { CategoriaReclamacao, TipoProtocolo } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import { BAIRROS_BATURITE } from '../../constants';
import { useToast } from '../ui/Toast';

interface ProtocoloFormProps {
    goBack: () => void;
}

const TIPO_PROTOCOLO_METADATA = {
  [TipoProtocolo.RECLAMACAO]: { title: 'Registrar Reclamação', icon: 'report_problem', description: 'Reporte problemas como buracos, iluminação, etc.' },
  [TipoProtocolo.SUGESTAO]: { title: 'Enviar Sugestão', icon: 'lightbulb', description: 'Dê ideias para melhorar nossa cidade.' },
  [TipoProtocolo.DENUNCIA]: { title: 'Fazer Denúncia', icon: 'security', description: 'Relate irregularidades de forma segura.' },
  [TipoProtocolo.ELOGIO]: { title: 'Fazer um Elogio', icon: 'thumb_up', description: 'Reconheça um bom serviço ou servidor.' },
};

const ProtocoloForm: React.FC<ProtocoloFormProps> = ({ goBack }) => {
    const [step, setStep] = useState(1);
    const [tipo, setTipo] = useState<TipoProtocolo | null>(null);

    const [categoria, setCategoria] = useState<CategoriaReclamacao | ''>('');
    const [bairro, setBairro] = useState<string>('');
    const [descricao, setDescricao] = useState('');
    const [foto, setFoto] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const [localizacao, setLocalizacao] = useState<{ lat: number, lng: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();

    const handleTypeSelect = (selectedType: TipoProtocolo) => {
        setTipo(selectedType);
        setStep(2);
    };

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFoto(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    const handleGetLocation = () => {
        setLocalizacao({ lat: -4.333, lng: -38.881 });
        addToast('Localização obtida com sucesso!', 'success');
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!tipo || !descricao || !bairro || (tipo === TipoProtocolo.RECLAMACAO && !categoria)) {
            addToast('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            console.log({ tipo, categoria, descricao, foto, localizacao, bairro });
            setIsSubmitting(false);
            addToast('Protocolo enviado com sucesso!', 'success');
            goBack();
        }, 1500);
    };

    if (step === 1) {
        return (
            <div className="space-y-4">
                <Button onClick={goBack} variant="ghost" iconLeft="arrow_back">Voltar</Button>
                <Card>
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Participação Cidadã</h2>
                        <p className="text-slate-600 mt-1">Qual tipo de protocolo você deseja abrir?</p>
                    </div>
                    <div className="space-y-3">
                        {Object.values(TipoProtocolo).map(type => (
                            <Card key={type} onClick={() => handleTypeSelect(type)} className="flex items-center space-x-4 text-left !p-4 border-2 border-transparent hover:border-indigo-500 hover:shadow-lg">
                                <Icon name={TIPO_PROTOCOLO_METADATA[type].icon} className="text-3xl text-indigo-600" />
                                <div>
                                    <h3 className="font-bold text-slate-800">{TIPO_PROTOCOLO_METADATA[type].title}</h3>
                                    <p className="text-sm text-slate-500">{TIPO_PROTOCOLO_METADATA[type].description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Button onClick={() => setStep(1)} variant="ghost" iconLeft="arrow_back">Mudar tipo</Button>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">{TIPO_PROTOCOLO_METADATA[tipo!]?.title}</h2>
                    
                    {tipo === TipoProtocolo.RECLAMACAO && (
                        <div>
                            <label htmlFor="categoria" className="block text-sm font-medium text-slate-700 mb-1">Categoria *</label>
                            <select
                                id="categoria"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value as CategoriaReclamacao)}
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600"
                            >
                                <option value="" disabled>Selecione uma categoria</option>
                                {Object.values(CategoriaReclamacao).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    )}

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
                            placeholder="Descreva sua solicitação com o máximo de detalhes."
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
                         <label className="block text-sm font-medium text-slate-700">Localização (Opcional)</label>
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
                        {isSubmitting ? 'Enviando...' : 'Enviar Protocolo'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default ProtocoloForm;