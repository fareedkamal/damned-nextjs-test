import Products from '@/components/shop/products-listing/products';
import { text } from '../styles';

const SearchPage = ({ searchParams }: any) => {
  const { query } = searchParams;

  return (
    <div className='w-full px-[30px] py-[2em] md:[5em] 2xl:w-[1440px] m-auto'>
      <p className={`${text.md} font-medium`}>Search results for {query}</p>
      <Products search={query as any} showPagination={true} />
    </div>
  );
};

export default SearchPage;
