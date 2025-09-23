import { View } from '../types';

// Centralizes the logic to convert a View type and parameters into a URL path.
export const viewToPath = (view: View, params: any = {}): string => {
    switch (view) {
        case 'DASHBOARD': return '/';
        case 'ABOUT': return '/about';
        
        // Protocolos
        case 'PROTOCOLOS_LIST': return '/protocolos';
        case 'PROTOCOLO_DETAIL': return `/protocolos/${params.protocoloId}`;
        case 'PROTOCOLO_FORM': return '/protocolos/novo';
        
        // Notícias
        case 'NOTICIAS_LIST': return '/noticias';
        case 'NOTICIA_DETAIL': return `/noticias/${params.noticiaId}`;
        
        // Secretarias, Mapa, Contatos
        case 'SECRETARIAS_LIST': return '/secretarias';
        case 'MAPA_SERVICOS': return '/mapa';
        case 'CONTATOS_LIST': return '/contatos';
        
        // Turismo
        case 'TURISMO_DASHBOARD': return '/turismo';
        case 'TURISMO_LIST': return `/turismo/lista/${params.categoria}`;
        case 'TURISMO_DETAIL': return `/turismo/detalhe/${params.categoria}/${params.turismoId}`;
        
        // Serviços & Agendamentos
        case 'SERVICOS_ONLINE_DASHBOARD': return '/servicos';
        case 'SERVICO_FORM': return `/servicos/agendar/${params.servicoId}`;
        case 'AGENDAMENTOS_LIST': return '/agendamentos';
        
        // Participação Cidadã
        case 'PARTICIPACAO_FEED': return '/participacao';
        case 'PARTICIPACAO_DETAIL': return `/participacao/detalhe/${params.publicacaoId}`;
        case 'PARTICIPACAO_FORM': return '/participacao/novo';

        // Consultas Públicas
        case 'CONSULTAS_PUBLICAS_LIST': return '/consultas';
        case 'CONSULTAS_PUBLICAS_DETAIL': return `/consultas/${params.consultaId}`;
        
        default: 
            console.warn(`No path found for view: ${view}`);
            return '/';
    }
};
