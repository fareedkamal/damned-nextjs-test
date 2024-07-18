import ProductsList from '@/components/shop/products-listing';
import Products from '@/components/shop/products-listing/products';
import { fetchProducts } from '@/graphql';

const FixedBladeKnives: React.FC = async () => {
  return (
    <div className='w-full h-full px-8 py-4 m-auto'>
      <Products id={1266} showPagination={true} />
    </div>
  );
};

export default FixedBladeKnives;
