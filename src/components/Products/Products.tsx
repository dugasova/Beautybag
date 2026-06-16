import { useEffect, useState, useRef, useCallback } from 'react';
import './Products.css';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryFilter } from '../../store/features/search/slice';
import type { RootState } from '../../store/store';
import { selectFilteredProducts } from '../../store/features/goods/selectors';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../ui/Button/Button';
import ProductGrid from './ProductGrid';
import ProductFilters from './ProductFilters';

const INITIAL_COUNT = 8;
const LOAD_MORE_COUNT = 4;

export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoryName } = useParams<{ categoryName: string }>();

  const productsToDisplay = useSelector(selectFilteredProducts);
  const { categoryFilter } = useSelector((state: RootState) => state.search);
  const status = useSelector((state: RootState) => state.goods.status);

  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Sync URL param with Redux state
  useEffect(() => {
    if (categoryName) {
      dispatch(setCategoryFilter(categoryName));
    } else {
      dispatch(setCategoryFilter(''));
    }
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

  // Adjust state during render when category changes
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
              Category: {categoryFilter}
            </h2>
            <Button variant='secondary' size='sm' className="clear-filter-btn" onClick={handleClearFilter}>
              Show all products
            </Button>
          </div>
        )}
        <ProductFilters />
        <ProductGrid
          products={currentProducts}
          status={status}
        />
        
        {/* Intersection Observer Target */}
        {productsToDisplay.length > visibleCount && (
          <div ref={observerTarget} className="infinite-scroll-trigger">
            <div className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
