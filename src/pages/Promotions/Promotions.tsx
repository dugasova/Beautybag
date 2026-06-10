import { useState, useEffect, useRef, useCallback } from 'react';
import './Promotions.css';
import { useTranslation } from 'react-i18next';
import ProductGrid from '../../components/Products/ProductGrid';
import { promoItems } from '../../mockedData';

const ITEMS_PER_PAGE = 8;

export default function Promotions() {
  const { t } = useTranslation();
  
  // States for visible items and loading
  const [visibleItems, setVisibleItems] = useState(promoItems.slice(0, ITEMS_PER_PAGE));
  const [hasMore, setHasMore] = useState(promoItems.length > ITEMS_PER_PAGE);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (isSyncing || !hasMore) return;
    
    setIsSyncing(true);
    
    // Simulate a network delay for a "Premium" feel
    setTimeout(() => {
      const nextLimit = visibleItems.length + ITEMS_PER_PAGE;
      const nextItems = promoItems.slice(0, nextLimit);
      
      setVisibleItems(nextItems);
      setHasMore(nextItems.length < promoItems.length);
      setIsSyncing(false);
    }, 800);
  }, [visibleItems.length, hasMore, isSyncing]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isSyncing) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, isSyncing]);

  return (
    <section className="promotions">
      <div className="container">
        <ProductGrid 
          products={visibleItems} 
          status="succeeded" 
          title={t('promotions.title')}
        />
        
        {/* The Loader element that triggers the infinite scroll */}
        <div ref={loaderRef} className="loader-boundary">
          {hasMore && (
            <div className="loading-more-container">
              <span className="loading-pulse"></span>
              <p>{t('common.loadingMore', 'Loading more amazing deals...')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
