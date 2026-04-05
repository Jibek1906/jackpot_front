import { useEffect } from 'react';
import TableSelectButton from '../components/TableSelectButton';
import { useInspectorStore } from '../store/inspectorStore';

export default function DealerTableSelect() {
  const { tables, isLoading, fetchInitialData, setSelectedTableId } =
    useInspectorStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  if (isLoading) {
    return (
      <div className='h-[100vh] w-full bg-[#030305] text-white flex items-center justify-center font-montserrat'>
        <span className='text-[#FFB800] text-[24px]'>Загрузка столов...</span>
      </div>
    );
  }

  const activeTables = tables.filter((table) => table.is_active);

  return (
    // Используем h-[100vh] и w-full для строгого заполнения окна
    <div className='h-[100vh] w-full bg-[#030305] text-white flex flex-col items-center pt-[40px] px-[32px] overflow-y-auto'>
      <h1 className='font-montserrat text-[36px] font-medium text-[#EFB64B] mb-[48px]'>
        Выбрать стол
      </h1>

      {/* Используем Grid для планшета: 2 колонки на средних экранах, 3 на больших */}
      <div className='w-full max-w-[1152px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] pb-[40px]'>
        {activeTables.length > 0 ? (
          activeTables.map((table) => (
            <TableSelectButton
              key={table.id}
              tableName={table.table_name}
              onClick={() => setSelectedTableId(table.id)}
              to={`/dealer/${table.id}`}
            />
          ))
        ) : (
          <p className='text-gray-400 text-center col-span-full text-[20px]'>
            Нет доступных столов
          </p>
        )}
      </div>
    </div>
  );
}
