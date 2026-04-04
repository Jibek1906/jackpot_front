import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useTvStore } from '../store/tvStore';

export default function useTvSocket(tvToken: string | null) {
  const { updatePool, addRecentWin, setAnimation } = useTvStore();

  // Подключаемся только если есть токен
  const socketUrl = tvToken
    ? `wss://jackpot.operator.kg/ws/tv/${tvToken}/`
    : null;

  const { lastJsonMessage } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (!lastJsonMessage) return;
    const data = lastJsonMessage as any;

    if (data.type === 'pool_update') {
      updatePool(data.pool, data.chips);
    } else if (data.type === 'win_update') {
      addRecentWin({
        amount: data.amount,
        time: data.time,
        winner_name: data.winner_name,
      });
    } else if (data.type === 'animation') {
      // Включаем анимацию
      setAnimation(data);
      // Выключаем через 10 секунд (или по клику, зависит от ТЗ)
      setTimeout(() => setAnimation(null), 10000);
    }
  }, [lastJsonMessage, updatePool, addRecentWin, setAnimation]);
}
