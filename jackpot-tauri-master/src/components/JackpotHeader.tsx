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
      // Высчитываем разницу
      const diff = currentNum - prevNum;
      setIncrementValue(`+ $${diff.toLocaleString('ru-RU')}`);

      // Показываем зеленую сумму
      setShowIncrement(true);

      // Прячем через 3 секунды
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
      <h2 className='absolute -top-2 left-1/4 font-oswald font-normal text-5xl leading-none bg-linear-to-b from-[#FFFFFF] via-[#FFFFFF] via-15% to-[#F69D36] text-transparent bg-clip-text [-webkit-text-stroke:0.2rem_#F69D36]'>
        JACKPOT
      </h2>

      {/* Контейнер для анимации переключения между суммами */}
      <div className='relative w-full flex items-center justify-center'>
        {/* ОСНОВНАЯ ЗОЛОТАЯ СУММА (скрывается, когда показываем прирост) */}
        <div
          className={`flex items-center justify-center transition-opacity duration-500 absolute ${
            showIncrement ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {amount.split('').map((char, index) => {
            if (char === ' ') return <div key={index} className='w-8' />;
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

        {/* ЗЕЛЕНАЯ СУММА ПРИРОСТА (Появляется поверх) */}
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
              // Реализация стилей из Figma (Градиент)
              background:
                'linear-gradient(180deg, #4ACD48 0%, #B7EFB5 50%, #33CD31 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              // Обводка (Border)
              WebkitTextStroke: '7.83px #35A92C',
              // Внутренние тени (Hard light белый сверху, обычный зеленый снизу)
              // Так как CSS не поддерживает inner shadow для текста напрямую,
              // мы имитируем это через сложную комбинацию drop-shadow на контейнере
              // и текста. Но для идеального совпадения с Figma мы используем filter.
              filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.5))',
            }}
          >
            {incrementValue}
          </span>
          {/* Хак для внутренних теней текста (Inner Shadow) в CSS */}
          <span
            className='font-oswald font-bold text-[9rem] leading-none tracking-wider absolute inset-0 mix-blend-hard-light pointer-events-none'
            style={{
              color: 'transparent',
              WebkitTextStroke: '0',
              // Верхняя белая тень + нижняя темно-зеленая
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
