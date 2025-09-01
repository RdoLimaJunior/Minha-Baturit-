

import { useState, useEffect } from 'react';
import { MOCK_PROTOCOLOS, MOCK_NOTICIAS, MOCK_SECRETARIAS, MOCK_PREDIOS_PUBLICOS, MOCK_TURISMO_ITENS, MOCK_CONTATOS, MOCK_SERVICOS_ONLINE, MOCK_AGENDAMENTOS, MOCK_NOTIFICACOES } from '../constants';
import { Protocolo, Noticia, Secretaria, PredioPublico, TurismoItem, ContatoUtil, ServicoOnline, Agendamento, Notificacao } from '../types';

const useMockData = <T,>(data: T, delay: number = 500) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<T | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setResult(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [data, delay]);

  return { data: result, loading, error };
};

export const useProtocolos = () => useMockData<Protocolo[]>(MOCK_PROTOCOLOS);
export const useProtocoloById = (id: string | null) => {
    const protocolos = MOCK_PROTOCOLOS;
    const protocolo = protocolos.find(c => c.id === id) || null;
    return useMockData<Protocolo | null>(protocolo);
};
export const useNoticias = () => useMockData<Noticia[]>(MOCK_NOTICIAS);
export const useNoticiaById = (id: string | null) => {
    const noticias = MOCK_NOTICIAS;
    const noticia = noticias.find(n => n.id === id) || null;
    return useMockData<Noticia | null>(noticia);
};
export const useSecretarias = () => useMockData<Secretaria[]>(MOCK_SECRETARIAS);
export const usePrediosPublicos = () => useMockData<PredioPublico[]>(MOCK_PREDIOS_PUBLICOS);
export const useTurismoItens = () => useMockData<TurismoItem[]>(MOCK_TURISMO_ITENS);
export const useTurismoItemById = (id: string | null) => {
    const itens = MOCK_TURISMO_ITENS;
    const item = itens.find(i => i.id === id) || null;
    return useMockData<TurismoItem | null>(item);
};
export const useContatosUteis = () => useMockData<ContatoUtil[]>(MOCK_CONTATOS);
export const useServicosOnline = () => useMockData<ServicoOnline[]>(MOCK_SERVICOS_ONLINE);
export const useServicoOnlineById = (id: string | null) => {
    const servicos = MOCK_SERVICOS_ONLINE;
    const servico = servicos.find(s => s.id === id) || null;
    return useMockData<ServicoOnline | null>(servico);
};
export const useAgendamentos = () => useMockData<Agendamento[]>(MOCK_AGENDAMENTOS);
export const useNotificacoes = () => useMockData<Notificacao[]>(MOCK_NOTIFICACOES);