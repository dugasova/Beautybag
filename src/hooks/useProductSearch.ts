import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../store/store';

export function useProductSearch() {
  const { t } = useTranslation();
  const goods = useSelector((state: RootState) => state.goods.items);
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (query.trim().length < 3) return [];

    const searchTerm = query.trim().toLowerCase();
    return goods.filter((product) => {
      const productName = t(product.name).toLowerCase();
      const productDescription = t(product.description).toLowerCase();
      const productCategory = product.category.toLowerCase();
      const productSubCategory = product.subCategory.toLowerCase();

      return (
        productName.includes(searchTerm) ||
        productDescription.includes(searchTerm) ||
        productCategory.includes(searchTerm) ||
        productSubCategory.includes(searchTerm)
      );
    });
  }, [query, t, goods]);

  const resetSearch = () => {
    setQuery('');
  };

  return { query, setQuery, searchResults, resetSearch };
}
