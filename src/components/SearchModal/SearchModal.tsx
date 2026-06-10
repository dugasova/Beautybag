import { useState, useEffect } from 'react';
import './SearchModal.css';
import closeIcon from '../../assets/icons/close.svg';
import searchIcon from '../../assets/icons/search.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSearchModalOpen, setSearch, setSearchList, clearSearch } from '../../store/features/search/slice';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';

export default function SearchModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const initialSearch = useSelector((state: RootState) => state.search.search);
  const [query, setQuery] = useState(initialSearch);
  const searchResults = useSelector((state: RootState) => state.search.searchList);
  const goods = useSelector((state: RootState) => state.goods.items);

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

  const handleCloseSearch = () => {
    dispatch(clearSearch());
    dispatch(setIsSearchModalOpen(false));
  }

  const handleProductClick = (productId: number) => {
    dispatch(setIsSearchModalOpen(false));
    navigate(`/product/${productId}`);
  }

  return (
    <div className='search-modal'>
      <div className='search-modal-content'>
        <button className='search-modal-close' onClick={handleCloseSearch}>
          <img src={closeIcon} alt="close" className='close-icon' />
        </button>
        <div className='search-input-wrapper'>
          <img src={searchIcon} alt="search" className='search-icon' />
          <input
            type="text"
            placeholder={t('search.placeholder') || 'Search products...'}
            className='search-input'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        
        {query.trim().length >= 3 && (
          <div className='search-results-container'>
            {searchResults.length > 0 ? (
              <ul className='search-results-list'>
                {searchResults.map((product) => (
                  <li 
                    key={product.id} 
                    className='search-result-item'
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img src={product.imsrcOfImg} alt={t(product.name)} className='result-thumb' />
                    <div className='result-info'>
                      <span className='result-name'>{t(product.name)}</span>
                      <span className='result-category'>{product.category}</span>
                    </div>
                    <span className='result-price'>{product.price} UAH</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className='search-no-results'>
                {t('search.noResults') || 'No products found'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
