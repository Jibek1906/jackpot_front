import GlowCard from './GlowCard';
import { TvChip } from '../store/tvStore';

interface ChipCardProps {
  item: TvChip; // Используем новый интерфейс
  jackpotAmount: string;
}

export default function ChipCard({ item, jackpotAmount }: ChipCardProps) {
  // Превращаем "0.01" в "1%"
  const displayPercent = `${Number(item.payout_percent) * 100}%`;

  return (
    <GlowCard
      wrapperClassName='h-[10.75rem] shrink-0'
      className='flex items-center p-6 relative'
    >
      <div className='flex items-center gap-4 flex-1'>
        <span className='text-5xl font-bold font-montserrat whitespace-nowrap'>
          X{item.level} =
        </span>
        <img
          src={item.image}
          alt={item.color_name}
          className='w-28 h-28 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]'
        />
      </div>

      <span className='absolute bottom-3 left-6 text-base text-white tracking-wider uppercase font-medium'>
        {item.color_name}
      </span>

      {/* Условие: показываем блок только если is_cashable === true */}
      {item.is_cashable && (
        <div className='flex items-center h-full ml-4'>
          <div className='w-[0.0625rem] h-[70%] bg-white/20 mr-6'></div>
          <div className='flex flex-col items-center justify-center font-montserrat'>
            <span className='text-xs text-[#FFB800] mb-1 font-bold tracking-widest'>
              {jackpotAmount}
            </span>
            <span className='text-4xl font-bold text-[#FFB800] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'>
              {displayPercent}
            </span>
            <span className='text-[0.60rem] text-gray-300 mt-1 uppercase tracking-wide whitespace-nowrap'>
              от джекпота
            </span>
          </div>
        </div>
      )}
    </GlowCard>
  );
}