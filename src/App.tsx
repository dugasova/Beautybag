import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './pages/Layout';
import ErrorRoute from './routes/ErrorRoute';
import Home from './pages/Home/Home';
import { AuthContextProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthGuard from './HOC/AuthGuard';
import { ThemeProvider } from './context/ThemeContext';
import PageLoader from './components/ui/PageLoader/PageLoader';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const DeliveryRouteLazy = lazy(() => import('./pages/Delivery/Delivery'));
const PromotionsRouteLazy = lazy(() => import('./pages/Promotions/Promotions'));
const ContactRouteLazy = lazy(() => import('./pages/Contact/Contact'));
const LoginRouteLazy = lazy(() => import('./pages/Login/Login'));
const RegisterRouteLazy = lazy(() => import('./pages/Register/Register'));
const AccountRouteLazy = lazy(() => import('./pages/Account/Account'));
const WishListRouteLazy = lazy(() => import('./pages/WishList/WishList'));
const CartRouteLazy = lazy(() => import('./pages/Cart/Cart'));
const ProductRouteLazy = lazy(() => import('./pages/ProductPage/ProductPage'));
const CheckoutRouteLazy = lazy(() => import('./pages/Checkout/Checkout'));
const OrderSuccessRouteLazy = lazy(() => import('./pages/Checkout/OrderSuccess'));

const router = createBrowserRouter([
  {
    path: '/', element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/account', element: <AuthGuard><AccountRouteLazy /></AuthGuard> },
      { path: '/cart', element: <AuthGuard><CartRouteLazy /></AuthGuard> },
      { path: '/checkout', element: <AuthGuard><CheckoutRouteLazy /></AuthGuard> },
      { path: '/order-success', element: <AuthGuard><OrderSuccessRouteLazy /></AuthGuard> },
      { path: '/delivery', element: <DeliveryRouteLazy /> },
      { path: '/promotions', element: <PromotionsRouteLazy /> },
      { path: '/contact', element: <ContactRouteLazy /> },
      { path: '/login', element: <LoginRouteLazy /> },
      { path: '/register', element: <RegisterRouteLazy /> },
      { path: '/wishlist', element: <AuthGuard><WishListRouteLazy /></AuthGuard> },
      { path: '/product/:id', element: <ProductRouteLazy /> },
      { path: '/category/:categoryName', element: <Home /> },
      { path: '*', element: <ErrorRoute /> },
    ],
    errorElement: <ErrorRoute />
  }
]);

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthContextProvider>
          <ToastContainer position="bottom-right" />
          <Suspense fallback={<PageLoader />}>
            <RouterProvider router={router} />
          </Suspense>
        </AuthContextProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
