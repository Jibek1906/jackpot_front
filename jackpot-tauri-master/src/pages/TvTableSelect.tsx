import { useEffect } from 'react';
// Используем тот же стор, что и у инспектора, так как там уже есть логика загрузки списка столов
import { useInspectorStore } from '../store/inspectorStore';
import TableSelectButton from '../components/TableSelectButton';

export default function TvTableSelect() {
  const { tables, isLoading, fetchInitialData } = useInspectorStore();

  // При монтировании экрана запрашиваем список столов с бэкенда
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  if (isLoading) {
    return (
      <div className='h-screen w-full bg-black text-[#FFB800] flex items-center justify-center text-3xl font-montserrat'>
        Загрузка списка столов...
      </div>
    );
  }

  // Оставляем только активные столы
  const activeTables = tables.filter((table) => table.is_active);

  return (
    <div className='h-screen w-full bg-black text-white flex flex-col items-center pt-20 px-8 overflow-y-auto'>
      <h1 className='font-montserrat text-4xl font-medium text-[#EFB64B] mb-12 uppercase tracking-wider'>
        Настройка ТВ: Выберите стол
      </h1>

      <div className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10'>
        {activeTables.length > 0 ? (
          activeTables.map((table) => (
            <TableSelectButton
              key={table.id}
              tableName={table.table_name}
              // КРИТИЧЕСКОЕ ОТЛИЧИЕ: направляем на роут телевизора
              to={`/tv/${table.id}`}
            />
          ))
        ) : (
          <p className='text-gray-400 text-center col-span-full text-xl'>
            Нет доступных столов
          </p>
        )}
      </div>
    </div>
  );
}
