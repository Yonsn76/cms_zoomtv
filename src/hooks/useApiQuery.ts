import { useEffect, useRef, useState } from 'react';

interface UseApiQueryOptions {
  enabled?: boolean;
}

interface UseApiQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  abort: () => void;
}

export function useApiQuery<T>(
  queryFn: () => Promise<T>,
  options: UseApiQueryOptions = {}
): UseApiQueryResult<T> {
  const { enabled = true } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Ejecutando consulta...');
      const result = await queryFn();
      
      setData(result);
      console.log('✅ Consulta completada exitosamente');
    } catch (err: any) {
      console.error('❌ Error en consulta:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Error de conexión');
      }
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    executeQuery();
  };

  const abort = () => {
    // No hay nada que cancelar
  };

  useEffect(() => {
    if (enabled) {
      refetch();
    }
  }, [enabled]);

  return {
    data,
    loading,
    error,
    refetch,
    abort
  };
}
