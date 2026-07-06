import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ProductItem from './ProductItem';
import Skeleton from '../Skeleton/Skeleton';
import Button from '../ui/Button/Button';
import './ProductGrid.css';
import type { IProduct } from '../../types';

interface ProductGridProps {
  products: IProduct[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  title?: string;
  skeletonCount?: number;
  onRetry?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export default function ProductGrid({
  products,
  status,
  title,
  skeletonCount = 8,
  onRetry
}: ProductGridProps) {
  const { t } = useTranslation();

  return (
    <div className="product-grid-container">
      {title && <h2 className="grid-title">{title}</h2>}
      
      <motion.ul 
        className="products-list"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {status === 'loading' && 
          Array(skeletonCount).fill(null).map((_, idx) => (
            <Skeleton key={idx} />
          ))
        }
        
        <AnimatePresence mode='popLayout'>
          {status === 'succeeded' && products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </AnimatePresence>

        {status === 'succeeded' && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="no-products"
          >
            {t('search.noResults')}
          </motion.div>
        )}

        {status === 'failed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="no-products product-grid-error"
            role="alert"
          >
            <p>{t('common.error')}</p>
            {onRetry && (
              <Button variant="secondary" size="sm" onClick={onRetry}>
                {t('common.retry')}
              </Button>
            )}
          </motion.div>
        )}
      </motion.ul>
    </div>
  );
}
