import { Outlet } from 'react-router-dom'
import Header from '../components/Header/Header';
import Menu from '../components/Menu/Menu';
import Footer from '../components/Footer/Footer';
import useFirestoreSync from '../hooks/useFirestoreSync';
import ScrollToTop from '../components/ui/ScrollToTop/ScrollToTop';
import Breadcrumbs from '../components/ui/Breadcrumbs/Breadcrumbs';

export default function Layout() {
  useFirestoreSync();
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
