import { useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useTvStore } from '../store/tvStore';
import TText from './TText';

interface AnimationOverlayProps {
  data: any; // Убрали знак вопроса, теперь пропс снова обязательный
}

export default function AnimationOverlay({ data }: AnimationOverlayProps) {
  const { chips, currentPool, tableName } = useTvStore();

  // Ищем реальную фишку по данным из сокета
  const activeChip = chips.find((chip) => chip.level === data.level);
  const isCashable = activeChip?.is_cashable ?? true;

  const rawAmount = data.amount
    ? Number(data.amount)
    : Number(currentPool) * Number(activeChip?.payout_percent || 0);

  const formattedAmount = `$${rawAmount.toLocaleString('ru-RU', {
    maximumFractionDigits: 0,
  })}`;

  const formattedJackpot = `$${Number(currentPool).toLocaleString('ru-RU', {
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
      {/* КРУГ-ГОРИЗОНТ */}
      <div className='absolute bottom-[-100.5rem] left-1/2 -translate-x-1/2 w-[162rem] h-[162rem] animate-[spin_20s_linear_infinite] pointer-events-none z-0'>
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

      <div className='absolute bottom-[14rem] z-10 flex flex-col items-center animate-in zoom-in duration-700 delay-300 fill-mode-both'>
        {/* Номер стола (всегда сверху) */}
        <span className='text-[#FFB800] font-montserrat font-bold text-4xl tracking-widest mb-8 z-30 flex items-center gap-3'>
          <TText tKey='tv.table' fallback='СТОЛ' />{' '}
          {tableName.replace(/стол|table/i, '').trim()}
        </span>

        {/* Логика переключения */}
        {isCashable ? (
          // ВАРИАНТ 1: Фишка с деньгами (с процентами)
          <div className='flex items-center gap-8 z-30'>
            {/* Имя и картинка фишки */}
            <div className='flex flex-col items-center gap-3'>
              <span className='text-white text-xl font-montserrat font-medium tracking-widest uppercase'>
                {activeChip?.color_name || ''}
              </span>
              <div className='w-40 h-40 flex items-center justify-center'>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt=''
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
            </div>

            {/* Знак равно */}
            <span className='text-[#FFB800] font-bold text-7xl mt-8 font-montserrat'>
              =
            </span>

            {/* Выигрыш */}
            <div className='flex flex-col items-center gap-3'>
              <span className='text-white text-xl font-montserrat font-medium tracking-widest uppercase'>
                {activeChip?.payout_percent
                  ? `${Number(activeChip.payout_percent) * 100}% ОТ ДЖЕКПОТА`
                  : ''}
              </span>
              <h1 className='font-oswald font-bold text-[8.5rem] leading-none bg-linear-to-b from-[#FFF0A8] via-[#FFB800] to-[#CC9300] text-transparent bg-clip-text [-webkit-text-stroke:3px_#593A00] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]'>
                {formattedAmount}
              </h1>
            </div>
          </div>
        ) : (
          // ВАРИАНТ 2: Фишка-пустышка / физический приз
          <div className='flex flex-col items-center gap-6 z-30'>
            <div className='w-56 h-56 flex items-center justify-center'>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt=''
                  className='w-full h-full object-contain drop-shadow-[0_0_40px_rgba(255,184,0,0.6)]'
                />
              ) : (
                <div className='w-[14rem] h-[14rem] rounded-full bg-purple-700 border-4 border-purple-400 flex items-center justify-center shadow-[0_0_50px_rgba(147,51,234,0.6)]'>
                  <span className='text-white text-6xl font-bold'>
                    x{data.level}
                  </span>
                </div>
              )}
            </div>
            <span className='text-white font-montserrat font-bold text-5xl tracking-widest uppercase'>
              {activeChip?.color_name || ''}
            </span>
          </div>
        )}

        {/* Общий джекпот (всегда снизу) */}
        <div className='mt-12 flex items-center gap-6 z-30'>
          <span className='text-[#FFB800] font-oswald text-[3.5rem] tracking-widest'>
            <TText tKey='tv.jackpot' fallback='JACKPOT' />
          </span>
          <span className='font-oswald font-bold text-[5.5rem] leading-none bg-linear-to-b from-[#FFF0A8] via-[#FFB800] to-[#CC9300] text-transparent bg-clip-text [-webkit-text-stroke:2px_#593A00] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]'>
            {formattedJackpot}
          </span>
        </div>
      </div>
    </div>
  );
}
