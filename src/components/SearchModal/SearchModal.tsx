import './SearchModal.css';
import closeIcon from '../../assets/icons/close.svg';
import searchIcon from '../../assets/icons/search.svg';
import { useDispatch } from 'react-redux';
import { setIsSearchModalOpen } from '../../store/features/search/slice';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SearchResultItem from './SearchResultItem';
import { useProductSearch } from '../../hooks/useProductSearch';

export default function SearchModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { query, setQuery, searchResults, resetSearch } = useProductSearch();

  const handleCloseSearch = () => {
    resetSearch();
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
                  <SearchResultItem key={product.id} product={product} onSelect={handleProductClick} />
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
