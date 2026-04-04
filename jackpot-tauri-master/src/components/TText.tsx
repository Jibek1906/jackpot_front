import { useState, useEffect } from 'react';
import { useTvStore } from '../store/tvStore';

interface TTextProps {
  tKey: string;
  fallback: string;
}

export default function TText({ tKey, fallback }: TTextProps) {
  const { translations, currentLang } = useTvStore();
  const [fade, setFade] = useState(false);

  // Ищем перевод по ключу. Если его нет — показываем fallback
  const text = translations[tKey]?.[currentLang] || fallback;

  useEffect(() => {
    // Включаем "прозрачность", меняем текст, выключаем "прозрачность"
    setFade(true);
    const timer = setTimeout(() => setFade(false), 300);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <span
      className={`transition-opacity duration-300 ease-in-out ${
        fade ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {text}
    </span>
  );
}
