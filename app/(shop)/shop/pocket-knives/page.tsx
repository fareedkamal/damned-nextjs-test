import ProductsList from '@/components/shop/products-listing';
import Products from '@/components/shop/products-listing/products';
import { fetchProducts } from '@/graphql';

const PocketKnives: React.FC = async ({}) => {
  return (
    <div className='flex m-auto px-8 h-full w-full py-4 '>
      <Products id={1181} showPagination={true} />
    </div>
  );
};

export default PocketKnives;
