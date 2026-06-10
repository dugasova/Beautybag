import './Home.css';
import Products from '../../components/Products/Products';
import Banner from '../../components/Banner/Banner';

export default function Home() {
  return (
    <div className='home'>
      <Banner />
      <Products />
    </div>
  )
}
