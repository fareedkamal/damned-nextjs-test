import EdcMain from '@/components/shop/edc/page';
import EdcBack from '@/components/shop/edc/edcBack';
import ProductsList from '@/components/shop/products-listing';
import { fetchProducts } from '@/graphql';
import Products from '@/components/shop/products-listing/products';

const Edc: React.FC = async () => {
  return (
    <div>
      <div className='fixed h-screen w-screen overflow-hidden left-0 top-0 -z-50'>
        <video
          loop
          autoPlay
          playsInline
          muted
          className='w-full h-full object-cover'
          src='https://admin.damneddesigns.com/wp-content/uploads/EDC.mp4'
        >
          <source
            type='video/mp4'
            src='https://admin.damneddesigns.com/wp-content/uploads/EDC.mp4'
          />
        </video>
      </div>

      <div className='flex m-auto px-8 w-full h-[400px] md:h-[70vh]'>
        <div className='text-white my-auto text-center md:text-left'>
          <p className='text-2xl md:text-3xl mb-2'>POCKET ART</p>
          <p className='text-base mb-4'>
            From knucks to beads from patches to coins. This is where you’ll
            find them.
          </p>
        </div>
      </div>

      <div className='flex m-auto px-8 min-h-[500px] h-full bg-white w-full'>
        <Products id={1143} showPagination={true} />
      </div>
    </div>
  );
};

export default Edc;
