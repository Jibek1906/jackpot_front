import { ChipLevel } from '../store/inspectorStore';
import GlowCard from './GlowCard';

interface DealerChipCardProps {
  item: ChipLevel;
  currentPool: number;
  onClick: () => void;
}

export default function DealerChipCard({
  item,
  currentPool,
  onClick,
}: DealerChipCardProps) {
  const winAmount = item.calculated_value
    ? item.calculated_value
    : (currentPool * Number(item.payout_percent)).toFixed(2);

  return (
    <button
      onClick={onClick}
      className='h-[112px] w-full text-left transition-transform active:scale-95 hover:brightness-110 shrink-0'
    >
      <GlowCard
        wrapperClassName='h-[112px]'
        className='flex items-center p-[12px] relative overflow-hidden'
      >
        <div className='flex items-center justify-between flex-1 gap-[16px] px-[12px]'>
          <div className='flex flex-col items-start'>
            <span className='text-[30px] font-bold font-montserrat whitespace-nowrap text-white'>
              X{item.level_num} =
            </span>
            <span className='text-[18px] font-bold text-[#FFB800] -mt-[3px]'>
              ${Number(winAmount).toLocaleString('ru-RU')}
            </span>
          </div>

          <img
            src={item.image || ''}
            alt={item.color_name}
            className='w-[80px] h-[80px] object-contain drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]'
          />
        </div>

        <span className='absolute bottom-[6px] left-[24px] text-[14px] text-white/60 tracking-wider uppercase font-medium'>
          {item.color_name}
        </span>
      </GlowCard>
    </button>
  );
}
