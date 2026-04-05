import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTvStore } from '../store/tvStore';
import useTvSocket from '../hooks/useTvSocket';

import TableBadge from '../components/TableBadge';
import JackpotHeader from '../components/JackpotHeader';
import SectionTitle from '../components/SectionTitle';
import WinConditions from '../components/WinConditions';
import ChipCard from '../components/ChipCard';
import BottomBar from '../components/BottomBar';
import LatestWins from '../components/LatestWins';
import FloatingParticles from '../components/FloatingParticles';
import bg from '/table-bg.png';
import AnimationOverlay from '../components/AnimationOverlay';
import TText from '../components/TText';

function TvScreen() {
  // Достаем токен из ссылки
  const { tvToken: tokenFromUrl } = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    isLoading,
    currentPool,
    tableName, // Название стола из стора
    tvToken,
    initTvData,
    chips,
    activeAnimation,
    setNextLanguage,
  } = useTvStore();

  useEffect(() => {
    if (tokenFromUrl) {
      initTvData(tokenFromUrl);
    }
  }, [tokenFromUrl, initTvData]);

  // Подключаемся к сокету по токену
  useTvSocket(tvToken);

  useEffect(() => {
    if (isLoading) return;
    const langTimer = setInterval(() => {
      setNextLanguage();
    }, 3000);
    return () => clearInterval(langTimer);
  }, [isLoading, setNextLanguage]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || chips.length === 0) return;

    let animationId: number;
    let direction = 1;
    const speed = 0.6;

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
  }, [chips]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-black text-[#FFB800] flex items-center justify-center text-3xl'>
        Загрузка ТВ...
      </div>
    );
  }

  const formattedAmount = `$${Number(currentPool).toLocaleString('ru-RU', { maximumFractionDigits: 0 })}`;

  return (
    <div
      className='p-10 min-h-screen bg-center bg-cover bg-no-repeat text-white flex flex-col relative z-0 overflow-hidden'
      style={{ backgroundImage: `url(${bg})` }}
    >
      <FloatingParticles enableAnimation={true} particleCount={100} />

      <div className='flex flex-1 relative z-10'>
        <div className='flex-1 flex flex-col relative min-w-0'>
          <TableBadge tableName={tableName} />
          <JackpotHeader amount={formattedAmount} />

          <div className='w-full mt-8 relative z-10'>
            <SectionTitle
              highlightText={<TText tKey='tv.win_action' fallback='ВЫИГРАЙ' />}
              text={<TText tKey='tv.jackpot' fallback='ДЖЕКПОТ' />}
            />
            <WinConditions />
          </div>
        </div>

        <div className='w-[25%] pl-10 flex flex-col relative z-10'>
          <h2 className='text-[#EFB64B] text-2xl font-bold mb-2.5 whitespace-nowrap'>
            <TText tKey='tv.recent_winners' fallback='ПОСЛЕДНИЕ ВЫИГРЫШИ' />
          </h2>

          <div className='flex-1 min-h-0 mt-2 relative'>
            <img
              className='absolute -top-2 left-0 mix-blend-screen w-full h-5 pointer-events-none'
              src='/blink.png'
              alt=''
            />
            <LatestWins />
          </div>
        </div>
      </div>

      <div className='mt-8 overflow-hidden max-w-full relative z-10'>
        <SectionTitle
          highlightText={<TText tKey='tv.payout' fallback='ВЫИГРЫШ' />}
        />

        <div className='flex gap-1.5 overflow-hidden' ref={scrollRef}>
          {chips.map((item) => (
            <ChipCard
              key={item.level}
              item={item}
              jackpotAmount={formattedAmount}
            />
          ))}
        </div>
      </div>

      <BottomBar />

      {activeAnimation && <AnimationOverlay data={activeAnimation} />}
      {/* <AnimationOverlay data={null} /> */}
    </div>
  );
}

export default TvScreen;