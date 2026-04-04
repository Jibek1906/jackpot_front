import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useInspectorStore } from '../store/inspectorStore';

export default function useStaffSocket() {
  const updateTablePool = useInspectorStore((state) => state.updateTablePool);

  // Формируем URL
  const socketUrl = 'wss://jackpot.operator.kg/ws/staff/';

  const { lastJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log('WebSocket Staff Connected'),
    shouldReconnect: () => true, // Авто-реконнект
  });

  // ИСПРАВЛЕНИЕ: Оборачиваем в useEffect!
  useEffect(() => {
    if (lastJsonMessage) {
      const data = lastJsonMessage as any;

      if (data.type === 'report_update') {
        console.log('Получено обновление пула по сокету:', data);
        updateTablePool(data.table_id, data.pool, data.chips);
      }
    }
  }, [lastJsonMessage, updateTablePool]); // Срабатывает только при смене сообщения
}
