import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import imgSala1 from '../assets/sala.JPG';
import imgDestaque from '../assets/areagourmet2.jpeg';
import imgQuartoSuite2 from '../assets/quarto-suite2.JPG';
import imgFrente from '../assets/frente-casa.JPG';

export const ConfigContext = createContext();

// Mock inicial (fallback caso falhe o db)
const fallbackEnvironments = [
  { id: 'sala', title: 'Sala de Estar e Jantar', cover: imgSala1, photos: [] },
  { id: 'cozinha', title: 'Cozinha Completa', cover: imgDestaque, photos: [] },
  { id: 'quartos', title: 'Suítes Confortáveis', cover: imgQuartoSuite2, photos: [] },
  { id: 'area-externa', title: 'Área Gourmet e Lazer', cover: imgFrente, photos: [] }
];

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    diaria: 850,
    taxaFaxina: 150,
    energiaKwh: 1.30,
    totalViews: 0,
    blockedDates: [], // array de strings 'YYYY-MM-DD'
    customPrices: {}, // { 'YYYY-MM-DD': preco }
    environments: fallbackEnvironments
  });

  const [loading, setLoading] = useState(true);

  // Busca inicial dos dados no Supabase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Busca configurações globais
      const { data: globalData } = await supabase.from('global_settings').select('*').eq('id', 1).single();
      
      // 2. Busca calendário
      const { data: calendarData } = await supabase.from('calendar_overrides').select('*');
      
      const blockedDates = [];
      const customPrices = {};
      
      if (calendarData) {
        calendarData.forEach(item => {
          if (item.is_blocked) blockedDates.push(item.date);
          if (item.custom_price) customPrices[item.date] = item.custom_price;
        });
      }

      // 3. Busca fotos dos ambientes
      const { data: photosData } = await supabase.from('environment_photos').select('*').order('created_at', { ascending: false });
      
      const newEnvironments = fallbackEnvironments.map(env => {
        const envPhotos = photosData 
          ? photosData.filter(p => p.environment_id === env.id).map(p => p.image_url) 
          : [];
        // Se a galeria estiver vazia, bota a cover para não ficar 100% vazio no teste inicial
        return { ...env, photos: envPhotos.length > 0 ? envPhotos : [env.cover] };
      });

      if (globalData) {
        setConfig({
          diaria: globalData.diaria,
          taxaFaxina: globalData.taxa_faxina,
          energiaKwh: globalData.energia_kwh,
          totalViews: globalData.total_views,
          blockedDates,
          customPrices,
          environments: newEnvironments
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados do Supabase:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (newConfig) => {
    // Atualiza o estado local para parecer instantâneo
    setConfig(prev => ({ ...prev, ...newConfig }));

    // Atualiza na nuvem
    if (newConfig.diaria !== undefined || newConfig.taxaFaxina !== undefined || newConfig.energiaKwh !== undefined) {
      await supabase.from('global_settings').update({
        diaria: newConfig.diaria || config.diaria,
        taxa_faxina: newConfig.taxaFaxina || config.taxaFaxina,
        energia_kwh: newConfig.energiaKwh || config.energiaKwh
      }).eq('id', 1);
    }
  };

  const incrementView = async () => {
    // Lê e incrementa no banco usando RPC ou simplesmente somando local e mandando (menos preciso mas serve)
    const newViews = config.totalViews + 1;
    setConfig(prev => ({ ...prev, totalViews: newViews }));
    await supabase.from('global_settings').update({ total_views: newViews }).eq('id', 1);
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, incrementView, fetchData, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};
