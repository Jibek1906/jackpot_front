import { useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useTvStore } from '../store/tvStore';
import TText from './TText'; // 1. Добавили импорт компонента для перевода

interface AnimationOverlayProps {
  data: any;
  // 2. Убрали tableId отсюда, он нам больше не нужен
}

export default function AnimationOverlay({ data }: AnimationOverlayProps) {
  // 3. Вытаскиваем tableName из нашего стора вместе с остальными данными
  const { chips, currentPool, tableName } = useTvStore();

  const activeChip = chips.find((chip) => chip.level === data.level);

  const rawAmount = data.amount
    ? Number(data.amount)
    : Number(currentPool) * Number(activeChip?.payout_percent || 0);

  const formattedAmount = `$${rawAmount.toLocaleString('ru-RU', {
    maximumFractionDigits: 0,
  })}`;

  const imageUrl = activeChip?.image || '';

  const congratulationText = useMemo(() => {
    return 'CONGRATULATIONS! • 恭喜你! • ПОЗДРАВЛЯЕМ! • '.repeat(1);
  }, []);

  useEffect(() => {
    const duration = 10 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#DAA520'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#DAA520'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-500 overflow-hidden'>
      <div className='absolute bottom-[-65.5rem] left-1/2 -translate-x-1/2 w-[120rem] h-[120rem] animate-[spin_20s_linear_infinite] pointer-events-none z-0'>
        <svg viewBox='0 0 2000 2000' className='w-full h-full'>
          <path
            id='textPath'
            d='M 1000, 1000 m -800, 0 a 800,800 0 1,1 1600,0 a 800,800 0 1,1 -1600,0'
            fill='none'
          />
          <text fill='#F69D36'>
            <textPath
              href='#textPath'
              startOffset='0%'
              className='font-montserrat font-bold uppercase drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]'
              style={{
                fontSize: '7rem',
                letterSpacing: '0.6rem',
              }}
            >
              {congratulationText}
              {congratulationText}
            </textPath>
          </text>
        </svg>
      </div>

      <div className='absolute bottom-[18.75rem] z-10 flex flex-col items-center animate-in zoom-in duration-700 delay-300 fill-mode-both'>
        <div className='w-[12rem] h-[12rem] flex items-center justify-center -mb-[2.5rem] z-20'>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Multiplier X${data.level}`}
              className='w-full h-full object-contain drop-shadow-[0_0_40px_rgba(255,184,0,0.6)]'
            />
          ) : (
            <div className='w-[10rem] h-[10rem] rounded-full bg-purple-700 border-4 border-purple-400 flex items-center justify-center shadow-[0_0_50px_rgba(147,51,234,0.6)]'>
              <span className='text-white text-4xl font-bold'>
                x{data.level}
              </span>
            </div>
          )}
        </div>

        <h1 className='font-oswald font-bold text-[9rem] leading-none bg-linear-to-b from-[#FFF0A8] via-[#FFB800] to-[#CC9300] text-transparent bg-clip-text [-webkit-text-stroke:4px_#593A00] drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] z-30'>
          {formattedAmount}
        </h1>

        {/* 4. Заменили хардкод текста на компонент перевода и вывели реальное имя стола */}
        <span className='text-[#FFB800] font-montserrat font-bold text-4xl tracking-widest mt-6 z-30 flex items-center gap-3'>
          <TText tKey='tv.table' fallback='СТОЛ' />{' '}
          {tableName.replace(/стол/i, '').trim()}
        </span>
      </div>
    </div>
  );
}
