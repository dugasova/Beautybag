import Button from '../../components/ui/Button/Button'
import StarRating from '../../components/ui/StarRating/StarRating'
import type { ICartItem, IProduct } from '../../types'
import { useTranslation } from 'react-i18next';

interface CartItemProps {
  item: ICartItem;
  onPlus: (product: ICartItem) => void;
  onMinus: (product: ICartItem) => void;
  onRemove: (product: IProduct) => void;
  onMoveToWishlist: (product: IProduct) => void;
}
export default function CartItem({ item, onPlus, onMinus, onRemove, onMoveToWishlist }: CartItemProps) {
  const { t } = useTranslation();
  return (
    <li className='cart-item'>
      <div className='cart-image-wrapper'>
        <img src={item.imsrcOfImg} alt={t(item.name)} className='cart-image' />
      </div>
      <div className='cart-details'>
        <div className='cart-quantity-controls'>
          <Button onClick={() => onMinus(item)} className='cart-quantity-btn'>-</Button>
          <span className='cart-quantity-display'>{item.totalQuantity}</span>
          <Button onClick={() => onPlus(item)} className='cart-quantity-btn'>+</Button>
        </div>
        <h3 className='cart-name'>{t(item.name)}</h3>
        <p className='cart-description'>{t(item.description)}</p>
        <div className='cart-price-info'>
          <span className='unit-price'>{item.discountPrice ?? item.price} UAH / {t('cart.unit')}</span>
          <span className='total-item-price'>{t('cart.subtotal')}: {(item.discountPrice ?? item.price) * item.totalQuantity} UAH</span>
          {item.discountPrice && (
            <span className='cart-item-discount'>{t('cart.discount')}: -{(item.price - item.discountPrice) * item.totalQuantity} UAH ({item.discount}%)</span>
          )}
        </div>
        <p className='cart-raiting'><StarRating rating={item.raiting} /></p>
        <div className='cart-item-actions'>
          <Button onClick={() => onMoveToWishlist(item)} variant="purple" size="md" className="product-button-custom move-to-wishlist">
            {t('cart.moveToWishlist')}
          </Button>
          <Button onClick={() => onRemove(item)} variant="purple" size="md" className="product-button-custom remove-from-cart">
            {t('cart.removeFromCart')}
          </Button>
        </div>
      </div>
    </li>
  )
}
