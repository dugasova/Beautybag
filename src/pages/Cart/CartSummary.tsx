import { useTranslation } from "react-i18next"
import Button from "../../components/ui/Button/Button";

interface CartSummaryProps {
  handleClearCart: () => void,
  handleCheckout: () => void
}

export default function CartSummary({ handleClearCart, handleCheckout }: CartSummaryProps) {
  const { t } = useTranslation();
  return (
    <div className='cart-actions'>
      <Button onClick={() => handleClearCart()} variant="purple" size="md" className="clear-cart-btn">
        {t('cart.clear')}
      </Button>
      <Button onClick={handleCheckout} variant="purple" size="md" className="checkout-btn">
        {t('cart.checkout')}
      </Button>
    </div>
  )
}
