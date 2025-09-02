import React from 'react';
import { View } from '../../types';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface AcessibilidadeProps {
  navigateTo: (view: View) => void;
}

const FONT_SIZES = ['sm', 'base', 'lg', 'xl'];

const FONT_SIZE_LABELS: Record<string, string> = {
  sm: 'Pequena',
  base: 'Normal',
  lg: 'Grande',
  xl: 'Extra Grande',
};

const Acessibilidade: React.FC<AcessibilidadeProps> = ({ navigateTo }) => {
  const { theme, setTheme, fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useAccessibility();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigateTo('MAIS_DASHBOARD')} variant="ghost" size="icon">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Acessibilidade</h2>
      </div>
      
      <Card>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">Modo de Exibição</h3>
        <div className="flex items-center space-x-2 rounded-lg bg-slate-100 dark:bg-slate-700 p-1">
            <button onClick={() => setTheme('light')} className={`flex-1 p-2 rounded-md font-semibold text-sm flex items-center justify-center transition-colors ${theme === 'light' ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-white shadow' : 'text-slate-500 dark:text-slate-300'}`}>
                <Icon name="light_mode" className="mr-2" /> Claro
            </button>
            <button onClick={() => setTheme('dark')} className={`flex-1 p-2 rounded-md font-semibold text-sm flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-white shadow' : 'text-slate-500 dark:text-slate-300'}`}>
                <Icon name="dark_mode" className="mr-2" /> Escuro
            </button>
            <button onClick={() => setTheme('system')} className={`flex-1 p-2 rounded-md font-semibold text-sm flex items-center justify-center transition-colors ${theme === 'system' ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-white shadow' : 'text-slate-500 dark:text-slate-300'}`}>
                <Icon name="devices" className="mr-2" /> Sistema
            </button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">Tamanho da Fonte</h3>
        <div className="text-center mb-4">
            <p className="text-slate-600 dark:text-slate-300">Tamanho atual: <span className="font-bold">{FONT_SIZE_LABELS[fontSize]}</span></p>
        </div>
        <div className="flex items-center justify-center space-x-2">
            <Button onClick={decreaseFontSize} size="icon" aria-label="Diminuir fonte" disabled={FONT_SIZES.indexOf(fontSize) === 0}><Icon name="text_decrease" /></Button>
            <div className="w-full max-w-xs h-1 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${(FONT_SIZES.indexOf(fontSize) / (FONT_SIZES.length - 1)) * 100}%`}}></div>
            </div>
            <Button onClick={increaseFontSize} size="icon" aria-label="Aumentar fonte" disabled={FONT_SIZES.indexOf(fontSize) === FONT_SIZES.length - 1}><Icon name="text_increase" /></Button>
        </div>
        <Button onClick={resetFontSize} variant="secondary" className="w-full mt-6">Restaurar Padrão</Button>
      </Card>
    </div>
  );
};

export default Acessibilidade;
