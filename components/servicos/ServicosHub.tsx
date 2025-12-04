import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Icon from '../ui/Icon';

const servicosPrincipais = [
  { path: '/protocolos', icon: 'list_alt', title: 'Protocolos', description: 'Abra e acompanhe suas solicitações.' },
  { path: '/agendamentos', icon: 'event', title: 'Agendamentos', description: 'Marque atendimentos presenciais.' },
  { path: '/mapa', icon: 'map', title: 'Mapa de Serviços', description: 'Encontre locais públicos no mapa.' },
  { path: '/contatos', icon: 'call', title: 'Contatos Úteis', description: 'Telefones de emergência e serviços.' },
];

const informativos = [
  { path: '/noticias', icon: 'feed', title: 'Notícias', description: 'Fique por dentro das novidades.' },
  { path: '/turismo', icon: 'tour', title: 'Turismo', description: 'Descubra os encantos de Baturité.' },
  { path: '/secretarias', icon: 'corporate_fare', title: 'Secretarias', description: 'Conheça os gestores e contatos.' },
];

const acessoRapido = [
  { title: 'Contra Cheques', link: 'https://layoutonline.layoutsistemas.com.br/login', icon: 'receipt_long' },
  { title: 'Portal do Contribuinte', link: 'https://www.xtronline.com.br/ce/baturite/', icon: 'paid' },
  { title: 'Chamamento Público', link: 'https://www.baturite.ce.gov.br/publicacoes.php?cat=27&Comp=&Exer=&dtini=&dtfim=&Num=&ta=3', icon: 'campaign' },
];

const ServicoItem: React.FC<{ icon: string; title: string; description: string; onClick: () => void; }> = ({ icon, title, description, onClick }) => (
    <Card onClick={onClick} className="!p-4 flex items-center space-x-4">
        <Icon name={icon} className="text-3xl text-slate-700" />
        <div className="flex-1">
            <h3 className="font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-600">{description}</p>
        </div>
        <Icon name="chevron_right" className="text-slate-400" />
    </Card>
);

const LinkExternoItem: React.FC<{ icon: string; title: string; link: string; }> = ({ icon, title, link }) => {
    const handleOpenLink = () => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };
    return (
        <Card onClick={handleOpenLink} className="!p-4 flex items-center space-x-4">
            <Icon name={icon} className="text-3xl text-slate-700" />
            <h3 className="font-bold text-slate-800 flex-1">{title}</h3>
            <Icon name="open_in_new" className="text-slate-400" />
        </Card>
    );
};

const ServicosHub: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-bold text-slate-700 mb-2 pl-1">Principais Serviços</h2>
        <div className="space-y-3">
          {servicosPrincipais.map(item => (
            <ServicoItem key={item.path} {...item} onClick={() => navigate(item.path)} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-700 mb-2 pl-1">Informativos</h2>
        <div className="space-y-3">
          {informativos.map(item => (
            <ServicoItem key={item.path} {...item} onClick={() => navigate(item.path)} />
          ))}
        </div>
      </section>

       <section>
          <h2 className="text-lg font-bold text-slate-700 mb-2 pl-1">Acesso Rápido</h2>
          <div className="space-y-3">
            {acessoRapido.map(item => (
              <LinkExternoItem key={item.title} {...item} />
            ))}
          </div>
      </section>
    </div>
  );
};

export default ServicosHub;
