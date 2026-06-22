import { useEffect } from 'react';
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import Header from '../components/Header/Header';
import Menu from '../components/Menu/Menu';
import Footer from '../components/Footer/Footer';
import useFirestoreSync from '../hooks/useFirestoreSync';
import { fetchGoods } from '../store/features/goods/slice';
import type { AppDispatch } from '../store/store';
import ScrollToTop from '../components/ui/ScrollToTop/ScrollToTop';
import Breadcrumbs from '../components/ui/Breadcrumbs/Breadcrumbs';

export default function Layout() {
  const dispatch = useDispatch<AppDispatch>();
  useFirestoreSync();

  useEffect(() => {
    dispatch(fetchGoods());
  }, [dispatch]);
  return (
    <>
      <header>
        <Header />
        <Menu />
      </header>
      <Breadcrumbs />
      <main>
        <Outlet />
      </main>
      <ScrollToTop />
      <footer>
        <Footer />
      </footer>
    </>
  )
}
