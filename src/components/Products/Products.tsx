import { useEffect, useState, useRef, useCallback } from 'react';
import './Products.css';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setCategoryFilter } from '../../store/features/search/slice';
import { selectCategoryFilter } from '../../store/features/search/selectors';
import { selectFilteredProducts } from '../../store/features/goods/selectors';
import type { RootState } from '../../store/store';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../ui/Button/Button';
import ProductGrid from './ProductGrid';
import ProductFilters from './ProductFilters';

const INITIAL_COUNT = 8;
const LOAD_MORE_COUNT = 4;

export default function Products() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoryName } = useParams<{ categoryName: string }>();

  const productsToDisplay = useSelector(selectFilteredProducts);
  const categoryFilter = useSelector(selectCategoryFilter);
  const status = useSelector((state: RootState) => state.goods.status);

  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(setCategoryFilter(categoryName ?? ''));
  }, [categoryName, dispatch]);

  const currentProducts = productsToDisplay.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  }, []);

  useEffect(() => {
    const currentTarget = observerTarget.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && productsToDisplay.length > visibleCount) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, productsToDisplay.length, visibleCount]);

  const [prevCategory, setPrevCategory] = useState(categoryFilter);

  if (categoryFilter !== prevCategory) {
    setPrevCategory(categoryFilter);
    setVisibleCount(INITIAL_COUNT);
  }

  const handleClearFilter = () => {
    navigate('/');
  };

  return (
    <div className="products">
      <div className="container">
        {categoryFilter && (
          <div className="filter-info">
            <h2 className="search-results-title">
              {t('filters.activeCategory', { name: categoryFilter })}
            </h2>
            <Button variant='secondary' size='sm' className="clear-filter-btn" onClick={handleClearFilter}>
              {t('filters.showAll')}
            </Button>
          </div>
        )}
        <ProductFilters />
        <ProductGrid
          products={currentProducts}
          status={status}
        />

        {productsToDisplay.length > visibleCount && (
          <div ref={observerTarget} className="infinite-scroll-trigger">
            <div className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
