import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useInspectorStore } from '../store/inspectorStore';
import DealerChipCard from '../components/DealerChipCard';
import useStaffSocket from '../hooks/useStaffSocket';

export default function DealerPanel() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    tables,
    chipLevels,
    submitBuyIn,
    triggerJackpot,
    selectedTableId,
    setSelectedTableId,
  } = useInspectorStore();

  const [exchangeCount, setExchangeCount] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentTable = tables.find((t) => t.id === Number(tableId));

  useStaffSocket();

  useEffect(() => {
    if (tableId && !selectedTableId) {
      setSelectedTableId(Number(tableId));
    }
  }, [tableId, selectedTableId, setSelectedTableId]);

  const handleAmountChange = (delta: number) => {
    setExchangeCount((prev) => Math.max(1, prev + delta));
  };

  const handleExchangeSubmit = async () => {
    if (!currentTable) return;
    setIsSubmitting(true);
    await submitBuyIn(currentTable.id, exchangeCount);
    setIsSubmitting(false);
  };

  const handleJackpotDeclare = async (chip: any) => {
    if (!currentTable) return;
    await triggerJackpot(currentTable.id, chip.level_num, chip.color_name);
  };

  const basePath = location.pathname.startsWith('/inspector')
    ? '/inspector'
    : '/dealer';

  if (!currentTable) {
    return (
      <div className='h-[100vh] w-full bg-[#030305] flex items-center justify-center text-white text-[24px]'>
        Загрузка стола...
      </div>
    );
  }

  return (
    <div className='h-[100vh] w-full bg-[#030305] text-white flex flex-col p-[16px] pt-[12px] font-montserrat overflow-hidden'>
      {/* Контейнер: добавили flex flex-col h-full для правильного скролла */}
      <div className='max-w-[420px] mx-auto w-full flex flex-col h-full'>
        
        {/* Шапка */}
        <div className='flex items-center justify-between mb-[16px] shrink-0 px-[8px]'>
          <button
            onClick={() => navigate(basePath)}
            className='text-gray-400 text-[14px] hover:text-white transition-colors'
          >
            ← К столам
          </button>
          <h1 className='text-[#EFB64B] text-[20px] font-bold uppercase tracking-wide'>
            {currentTable.table_name}
          </h1>
          <div className='w-[64px]'></div>
        </div>

        {/* Блок "Обмен" */}
        <div className='mb-[24px] shrink-0 bg-black/30 p-[16px] rounded-[12px] border border-white/5'>
          <div className='flex items-center justify-between mb-[12px]'>
            <h2 className='text-[18px] font-medium text-gray-200'>Обмен</h2>
            <span className='text-gray-400 text-[14px]'>
              (Фишки: {exchangeCount})
            </span>
          </div>

          <div className='flex w-full h-[56px] rounded-[8px] overflow-hidden border border-[#FFB800]/30 mb-[12px] bg-black/50'>
            <button
              onClick={() => handleAmountChange(-1)}
              className='w-[64px] text-[30px] hover:bg-white/5 transition-colors'
            >
              -
            </button>
            <div className='flex-1 flex items-center justify-center text-[30px] font-bold border-x border-[#FFB800]/30'>
              {exchangeCount}
            </div>
            <button
              onClick={() => handleAmountChange(1)}
              className='w-[64px] text-[30px] hover:bg-white/5 transition-colors'
            >
              +
            </button>
          </div>

          <button
            onClick={handleExchangeSubmit}
            disabled={isSubmitting}
            className='w-full py-[14px] rounded-[8px] bg-linear-to-b from-[#FFB800] to-[#E5A500] text-black font-bold text-[20px] active:scale-[0.98] transition-all disabled:opacity-50'
          >
            {isSubmitting ? 'Отправка...' : 'Подтвердить'}
          </button>
        </div>

        {/* Список фишек */}
        <div className='flex flex-col flex-1 min-h-0'>
          <h2 className='text-[18px] font-medium mb-[12px] text-gray-200 shrink-0 px-[8px]'>
            Объявить джекпот
          </h2>
          <div className='flex flex-col gap-[10px] overflow-y-auto pb-[24px] custom-scrollbar'>
            {chipLevels.map((chip) => (
              <DealerChipCard
                key={chip.id}
                item={chip}
                currentPool={Number(currentTable.current_pool)}
                onClick={() => handleJackpotDeclare(chip)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}