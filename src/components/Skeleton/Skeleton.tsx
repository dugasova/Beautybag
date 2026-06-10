import './Skeleton.css';

interface SkeletonProps {
  variant?: 'rectangle' | 'circle' | 'text' | 'product';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function Skeleton({ variant = 'rectangle', width, height, className = '' }: SkeletonProps) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'product') {
    return (
      <div className="skeleton-product-card">
        <div className="skeleton-image shimmer"></div>
        <div className="skeleton-content">
          <div className="skeleton-line title shimmer"></div>
          <div className="skeleton-line shimmer" style={{ width: '80%' }}></div>
          <div className="skeleton-line shimmer" style={{ width: '40%' }}></div>
          <div className="skeleton-button shimmer"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`skeleton ${variant} shimmer ${className}`} 
      style={style}
    ></div>
  );
}
