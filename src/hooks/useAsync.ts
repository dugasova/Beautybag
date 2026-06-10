import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

/**
 * A custom hook for handling asynchronous operations with automatic 
 * error reporting and loading state management.
 */
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
      
      // Use custom message if provided, otherwise fallback to generic error
      const message = errorMessage || t('common.error') || "Something went wrong. Please try again.";
      toast.error(message);
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [t]);

  return { execute, loading };
}
