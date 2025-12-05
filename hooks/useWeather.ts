import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mapWeatherCodeToIcon } from '../utils/helpers';

export interface WeatherData {
  temperature: number;
  condition: string;
  weatherCode: string; // Keep the original code for logic
  icon: string;
  color: string;
}

interface WeatherContextType {
  weather: WeatherData | null;
  isLoading: boolean;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async (url: string) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Weather API response not ok');
        const data = await response.json();
        const current = data.current_condition[0];
        const { icon, color } = mapWeatherCodeToIcon(current.weatherCode);
        setWeather({
          temperature: parseInt(current.temp_C, 10),
          condition: current.lang_pt[0].value,
          weatherCode: current.weatherCode,
          icon,
          color,
        });
      } catch (err) {
        console.warn("Failed to fetch weather, using mock data:", err);
        // Fallback mock data for Baturité
        setWeather({
            temperature: 28,
            condition: 'Parcialmente nublado',
            weatherCode: '116',
            icon: 'partly_cloudy_day',
            color: 'text-sky-600'
        });
      } finally {
        setIsLoading(false);
      }
    };

    const getWeatherData = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(`https://wttr.in/${latitude},${longitude}?format=j1&lang=pt`);
          },
          (geoError) => {
            console.warn(`Geolocation failed: ${geoError.message}. Falling back to city.`);
            fetchWeather('https://wttr.in/Baturite?format=j1&lang=pt');
          },
          { timeout: 10000 }
        );
      } else {
        console.warn('Geolocation not supported. Falling back to city.');
        fetchWeather('https://wttr.in/Baturite?format=j1&lang=pt');
      }
    };

    getWeatherData();
  }, []);

  // FIX: Replaced JSX with React.createElement to be compatible with a .ts file extension.
  // The JSX syntax was causing parsing errors.
  return React.createElement(WeatherContext.Provider, { value: { weather, isLoading } }, children);
};

export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (context === undefined) {
        throw new Error('useWeather must be used within a WeatherProvider');
    }
    return context;
};