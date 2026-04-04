import { create } from 'zustand';
import { apiClient } from '../api/client';

const LANGUAGES = ['ru', 'en', 'zh'];

export interface TvWinner {
  amount: string;
  time: string;
  winner_name: string;
}

export interface TvChip {
  level: number;
  color_id: string;
  color_name: string;
  payout_percent: string;
  value: string;
  image: string;
  is_cashable: boolean;
}

interface TvState {
  tvToken: string | null;
  tableName: string;
  currentPool: string;
  recentWins: TvWinner[];
  chips: TvChip[];
  promos: any[];
  isLoading: boolean;
  activeAnimation: any | null;

  translations: Record<string, Record<string, string>>;
  currentLang: string;

  initTvData: (token: string) => Promise<void>;
  setAnimation: (data: any | null) => void;
  updatePool: (pool: string, chips: TvChip[]) => void;
  addRecentWin: (win: TvWinner) => void;
  setNextLanguage: () => void;
}

export const useTvStore = create<TvState>((set) => ({
  tvToken: null,
  tableName: '',
  currentPool: '0.00',
  recentWins: [],
  chips: [],
  promos: [],
  isLoading: true,
  activeAnimation: null,

  translations: {},
  currentLang: 'ru',

  initTvData: async (token) => {
    set({ isLoading: true });
    try {
      // Бьем сразу по публичным эндпоинтам с использованием токена
      const [tvRes, translationsRes] = await Promise.all([
        apiClient.get(`/api/tv/${token}/`),
        apiClient.get('/api/translations/').catch(() => ({ data: {} })),
      ]);

      const tvData = tvRes.data;

      set({
        tvToken: token,
        tableName: tvData.table_name,
        currentPool: tvData.current_pool,
        chips: tvData.chips,
        recentWins: tvData.recent_winners || [],
        promos: tvData.promos || [],
        translations: translationsRes.data || {},
        isLoading: false,
      });
    } catch (error) {
      console.error('Ошибка инициализации ТВ:', error);
      set({ isLoading: false });
    }
  },

  setNextLanguage: () =>
    set((state) => {
      const currentIndex = LANGUAGES.indexOf(state.currentLang);
      const nextIndex = (currentIndex + 1) % LANGUAGES.length;
      return { currentLang: LANGUAGES[nextIndex] };
    }),

  setAnimation: (data) => set({ activeAnimation: data }),
  updatePool: (pool, chips) => set({ currentPool: pool, chips }),
  addRecentWin: (win) =>
    set((state) => ({
      recentWins: [win, ...state.recentWins].slice(0, 5),
    })),
}));
