import { useState, useEffect, useRef } from 'react';
import { goldNumbers } from '../helpers';
import bottomBorder from '../assets/bottom-border.png';

export default function JackpotHeader({ amount }: { amount: string }) {
  const [showIncrement, setShowIncrement] = useState(false);
  const [incrementValue, setIncrementValue] = useState('');
  const prevAmountRef = useRef(amount);

  useEffect(() => {
    // Очищаем строки от символов, оставляем только числа для математики
    const currentNum = Number(amount.replace(/\D/g, ''));
    const prevNum = Number(prevAmountRef.current.replace(/\D/g, ''));

    if (currentNum > prevNum && prevNum !== 0) {
      const diff = currentNum - prevNum;
      setIncrementValue(`+ $${diff.toLocaleString('ru-RU')}`);
      setShowIncrement(true);

      const timer = setTimeout(() => {
        setShowIncrement(false);
      }, 3000);

      prevAmountRef.current = amount;
      return () => clearTimeout(timer);
    }

    prevAmountRef.current = amount;
  }, [amount]);

  return (
    <div
      className='bg-contain bg-no-repeat bg-bottom py-22 relative flex items-center justify-center min-h-[16rem]'
      style={{ backgroundImage: `url(${bottomBorder})` }}
    >
      {/* ИСПРАВЛЕНИЕ 3: Подняли JACKPOT выше (-top-8 вместо -top-2) */}
      <h2 className='absolute -top-8 left-1/4 font-oswald font-normal text-5xl leading-none bg-linear-to-b from-[#FFFFFF] via-[#FFFFFF] via-15% to-[#F69D36] text-transparent bg-clip-text [-webkit-text-stroke:0.2rem_#F69D36]'>
        JACKPOT
      </h2>

      {/* ИСПРАВЛЕНИЕ 3: Добавили mt-4, чтобы цифры чуть спустились */}
      <div className='relative w-full flex items-center justify-center mt-4'>
        <div
          className={`flex items-center justify-center transition-opacity duration-500 absolute ${
            showIncrement ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {amount.split('').map((char, index) => {
            // ИСПРАВЛЕНИЕ 2: Ловим и обычный пробел, и неразрывный (\u00A0)
            if (char === ' ' || char === '\u00A0') {
              return <div key={index} className='w-8' />; // w-6 дает идеальный отступ
            }

            const src = goldNumbers[char];
            if (!src) return null;

            return (
              <img
                key={index}
                src={src}
                alt={char}
                className='h-45 object-contain first:ml-0 ml-2 pointer-events-none animate-jackpot'
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            );
          })}
        </div>

        <div
          className={`flex items-center justify-center transition-all duration-500 absolute ${
            showIncrement
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-110 -translate-y-4 pointer-events-none'
          }`}
        >
          <span
            className='font-oswald font-bold text-[9rem] leading-none tracking-wider'
            style={{
              background:
                'linear-gradient(180deg, #4ACD48 0%, #B7EFB5 50%, #33CD31 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '7.83px #35A92C',
              filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.5))',
            }}
          >
            {incrementValue}
          </span>
          <span
            className='font-oswald font-bold text-[9rem] leading-none tracking-wider absolute inset-0 mix-blend-hard-light pointer-events-none'
            style={{
              color: 'transparent',
              WebkitTextStroke: '0',
              textShadow:
                '0px 13px 11px rgba(255,255,255,0.82), 0px -31px 14px rgba(20,170,65,0.75)',
            }}
          >
            {incrementValue}
          </span>
        </div>
      </div>
    </div>
  );
}
