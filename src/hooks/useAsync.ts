import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function useAsync() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const execute = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T | null> => {
    setLoading(true);
    try {
      const result = await asyncFunction();
      if (successMessage) {
        toast.success(successMessage);
      }
      return result;
    } catch (error) {
      console.error("Async Error:", error);

      const message = errorMessage || t('common.error');
      toast.error(message);

      return null;
    } finally {
      setLoading(false);
    }
  }, [t]);

  return { execute, loading };
}
