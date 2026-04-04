import { create } from 'zustand';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

// Добавляем интерфейс для пагинированного ответа бэкенда
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface TableType {
  id: number;
  name: string;
  base_nominal: string;
  contribution_rate: string;
}

export interface GameTable {
  id: number;
  table_name: string;
  type: TableType;
  current_pool: string;
  tv_token: string;
  is_active: boolean;
}

export interface ChipLevel {
  id: number;
  level_num: number;
  color_name: string;
  color_id: string;
  payout_percent: string;
  is_cashable: boolean;
  image: string | null;
  calculated_value?: string;
}

interface InspectorState {
  tables: GameTable[];
  chipLevels: ChipLevel[];
  selectedTableId: number | null;
  isLoading: boolean;

  fetchInitialData: () => Promise<void>;
  setSelectedTableId: (id: number) => void;
  updateTablePool: (tableId: number, newPool: string, newChips?: any[]) => void;
  submitBuyIn: (tableId: number, count: number) => Promise<boolean>;
  triggerJackpot: (
    tableId: number,
    level: number,
    color: string,
  ) => Promise<boolean>;
}

export const useInspectorStore = create<InspectorState>((set) => ({
  tables: [],
  chipLevels: [],
  selectedTableId: null,
  isLoading: false,

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      // Указываем правильные типы для ответов: PaginatedResponse
      const [tablesRes, chipsRes] = await Promise.all([
        apiClient.get<PaginatedResponse<GameTable>>('/api/game-tables/'),
        apiClient.get<PaginatedResponse<ChipLevel>>('/api/chip-levels/'),
      ]);

      set({
        // Теперь TypeScript знает, что поле results точно существует и содержит нужный массив
        tables: tablesRes.data.results,
        chipLevels: chipsRes.data.results,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Ошибка загрузки данных инспектора:', error);
      toast.error('Не удалось загрузить данные столов');
      set({ isLoading: false });
    }
  },

  setSelectedTableId: (id) => set({ selectedTableId: id }),

  updateTablePool: (tableId, newPool, newChips) => {
    set((state) => {
      const updatedTables = state.tables.map((table) =>
        table.id === tableId ? { ...table, current_pool: newPool } : table,
      );

      let updatedChips = state.chipLevels;
      if (newChips && newChips.length > 0) {
        updatedChips = state.chipLevels.map((chip) => {
          const incomingChip = newChips.find(
            (c: any) => c.level === chip.level_num,
          );
          return incomingChip
            ? { ...chip, calculated_value: incomingChip.value }
            : chip;
        });
      }

      return { tables: updatedTables, chipLevels: updatedChips };
    });
  },

  submitBuyIn: async (tableId, count) => {
    try {
      await apiClient.post(`/api/game-tables/${tableId}/buy-in/`, { count });
      toast.success('Пул стола пополнен!');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Ошибка при пополнении');
      return false;
    }
  },

  triggerJackpot: async (tableId, level, color) => {
    try {
      await apiClient.post(`/api/game-tables/${tableId}/trigger-animation/`, {
        level,
        color,
      });
      toast.success(`Джекпот X${level} объявлен!`);
      return true;
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail || 'Ошибка при запуске анимации',
      );
      return false;
    }
  },
}));
