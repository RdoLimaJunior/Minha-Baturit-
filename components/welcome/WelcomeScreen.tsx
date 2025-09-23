import React from 'react';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeFeature: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-slate-800 text-white rounded-full">
      <Icon name={icon} className="text-2xl" />
    </div>
    <div>
      <h3 className="font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  </div>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col justify-between p-8 text-slate-800 text-center">
      <div className="flex-1 flex flex-col items-center justify-center">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Bras%C3%A3o_de_Baturit%C3%A9_-_CE.svg" 
          alt="Brasão de Baturité" 
          className="h-24"
        />
        <h1 className="text-4xl font-bold mt-6">Minha Baturité</h1>
        <p className="mt-2 max-w-md text-slate-600">
          O aplicativo oficial da Prefeitura. A cidade na palma da sua mão.
        </p>
      </div>

      <div className="flex-shrink-0 w-full max-w-md mx-auto space-y-6 text-left mb-8">
          <WelcomeFeature 
              icon="support_agent"
              title="Assistente Virtual"
              description="Tire dúvidas e seja guiado para os serviços certos conversando com nossa IA."
          />
          <WelcomeFeature 
              icon="apps"
              title="Serviços na sua Mão"
              description="Abra protocolos, agende atendimentos e acesse informações úteis de forma rápida."
          />
          <WelcomeFeature 
              icon="campaign"
              title="Participe e Colabore"
              description="Envie suas ideias, relate problemas e ajude a construir uma cidade melhor para todos."
          />
      </div>

      <div className="flex-shrink-0">
        <Button 
          onClick={onComplete}
          className="w-full max-w-md"
          size="lg"
        >
          Começar
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;