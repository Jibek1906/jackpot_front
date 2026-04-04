import { useEffect, useRef } from 'react';
import GlowCard from './GlowCard';
import { useTvStore } from '../store/tvStore';

export default function WinConditions() {
  const { promos, currentLang } = useTvStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Анимация пинг-понг скролла (как у фишек)
  useEffect(() => {
    const el = scrollRef.current;
    // Если карточек 2 или меньше, они и так влезают, скроллить не нужно
    if (!el || promos.length <= 2) return;

    let animationId: number;
    let direction = 1;
    const speed = 0.4; // Скорость скролла

    const step = () => {
      if (!el) return;
      el.scrollLeft += direction * speed;

      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
        direction = -1;
      } else if (el.scrollLeft <= 0) {
        direction = 1;
      }

      animationId = requestAnimationFrame(step);
    };

    const startTimeout = setTimeout(() => {
      animationId = requestAnimationFrame(step);
    }, 1000);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(animationId);
    };
  }, [promos]);

  // Функция для сохранения твоего дизайна: делает последнее слово огромным
  const formatPromoText = (text: string) => {
    const words = text.split(' ');
    if (words.length > 1) {
      const lastWord = words.pop();
      return (
        <>
          {words.join(' ')} <span className='text-8xl'>{lastWord}</span>
        </>
      );
    }
    return <span className='text-6xl'>{text}</span>; // Если слово одно (например "СОСЕДИ")
  };

  if (promos.length === 0) return null; // Если промо пока нет, ничего не рендерим

  return (
    // Заменили grid на flex + overflow-hidden для скролла
    <div
      className='flex gap-4 font-medium overflow-hidden w-full'
      ref={scrollRef}
    >
      {promos.map((promo, index) => {
        // Достаем текст на текущем языке (или фоллбэк на русский)
        const text = promo.text[currentLang] || promo.text['ru'] || '';

        return (
          <GlowCard
            key={index}
            // w-[calc(50%-0.5rem)] делает карточку ровно на половину контейнера с учетом gap-4
            className='flex shrink-0 items-center justify-between p-8 px-10'
            wrapperClassName='w-[calc(50%-0.5rem)]'
          >
            <span className='font-oswald text-6xl transition-opacity duration-300'>
              {formatPromoText(text)}
            </span>
            <img
              src={promo.image}
              className='w-78 h-60 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]'
              alt=''
            />
          </GlowCard>
        );
      })}
    </div>
  );
}
