import GlowCard from './GlowCard';
import { useTvStore } from '../store/tvStore';
import TText from './TText';

export default function LatestWins() {
  const { recentWins } = useTvStore();

  return (
    <GlowCard
      wrapperClassName='w-full h-full'
      className='relative flex flex-col items-center px-8 py-4 overflow-hidden'
    >
      <div className='w-full flex flex-col z-10 mt-2'>
        {recentWins.map((win, index) => (
          <div
            key={index}
            className='flex flex-col items-center py-7 border-b border-white/10 last:border-b-0'
          >
            <div className='text-[2.5rem] leading-none font-bold mb-3 font-montserrat flex items-center'>
              <span className='text-white mr-3'>
                <TText tKey='tv.win_label' fallback='WIN' />
              </span>
              <span className='text-[#FFB800] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'>
                $
                {Number(win.amount).toLocaleString('ru-RU', {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>

            <div className='text-gray-400 text-lg font-light tracking-wide font-montserrat'>
              {win.time} <span className='mx-3'>•</span>{' '}
              {win.winner_name || <TText tKey='tv.player' fallback='Игрок' />}
            </div>
          </div>
        ))}
        {recentWins.length === 0 && (
          <div className='text-gray-500 py-10 text-center'>
            <TText tKey='tv.waiting' fallback='Пока нет выигрышей' />
          </div>
        )}
      </div>
    </GlowCard>
  );
}
