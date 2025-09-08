import { useEffect, useRef, useState } from 'react';

interface UseApiQueryOptions {
  enabled?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

interface UseApiQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  abort: () => void;
}

export function useApiQuery<T>(
  queryFn: (signal: AbortSignal) => Promise<T>,
  options: UseApiQueryOptions = {}
): UseApiQueryResult<T> {
  const { enabled = true, retryCount = 3, retryDelay = 1000 } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

  const executeQuery = async (signal: AbortSignal, attempt = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Ejecutando consulta (intento ${attempt + 1})...`);
      const result = await queryFn(signal);
      
      if (!signal.aborted) {
        setData(result);
        console.log('✅ Consulta completada exitosamente');
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || signal.aborted) {
        console.log('🚫 Consulta cancelada');
        return;
      }
      
      console.error('❌ Error en consulta:', err);
      
      // Manejo específico para error 429 (Too Many Requests)
      if (err.response?.status === 429 && attempt < retryCount) {
        const delay = Math.pow(2, attempt) * retryDelay;
        console.log(`⏳ Rate limit alcanzado. Reintentando en ${delay}ms...`);
        setError(`Demasiadas solicitudes. Reintentando en ${delay/1000} segundos...`);
        
        retryTimeoutRef.current = setTimeout(() => {
          if (!signal.aborted) {
            executeQuery(signal, attempt + 1);
          }
        }, delay);
        return;
      }
      
      if (!signal.aborted) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError('Error de conexión');
        }
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  };

  const refetch = () => {
    // Cancelar consulta anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Crear nuevo AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    executeQuery(controller.signal);
  };

  const abort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  };

  useEffect(() => {
    if (enabled) {
      refetch();
    }
    
    // Cleanup al desmontar
    return () => {
      abort();
    };
  }, [enabled]);

  return {
    data,
    loading,
    error,
    refetch,
    abort
  };
}
