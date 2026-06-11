import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setSearch, setSearchList } from '../store/features/search/slice';
import type { RootState } from '../store/store';

export function useProductSearch() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const initialSearch = useSelector((state: RootState) => state.search.search);
  const searchResults = useSelector((state: RootState) => state.search.searchList);
  const goods = useSelector((state: RootState) => state.goods.items);
  const [query, setQuery] = useState(initialSearch);

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    if (query.trim().length >= 3) {
      const filteredResults = goods.filter((product) => {
        const productName = t(product.name).toLowerCase();
        const productDescription = t(product.description).toLowerCase();
        const productCategory = product.category.toLowerCase();
        const productSubCategory = product.subCategory.toLowerCase();
        const searchTerm = query.toLowerCase();

        return (
          productName.includes(searchTerm) ||
          productDescription.includes(searchTerm) ||
          productCategory.includes(searchTerm) ||
          productSubCategory.includes(searchTerm)
        );
      });
      dispatch(setSearchList(filteredResults));
    } else {
      dispatch(setSearchList([]));
    }
    dispatch(setSearch(query));
  }, [query, dispatch, t, goods]);

  return { query, setQuery, searchResults };
}
