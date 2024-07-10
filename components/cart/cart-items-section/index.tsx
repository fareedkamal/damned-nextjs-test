import { text } from '@/app/styles';
import { useSession } from '@/client/SessionProvider';
import CartItemList from './cart-items-list';
import CartTotal from '../cart-total';
import { dispatch } from '@/redux/store';
import { CartItem as CartItemInterface } from '@/graphql';
import { setCartClose, setCartSection } from '@/redux/slices/cart-slice';

const CartItemsSection = () => {
  const { cart } = useSession();
  const items = (cart?.contents?.nodes || []) as CartItemInterface[];

  return (
    <>
      <div className='w-full flex justify-between border-b'>
        <div className={`${text.md} font-medium p-2`}>
          <div>CART</div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className='flex h-screen p-4'>
          <div className='m-auto text-center'>
            <p className='mb-6'>Your cart is empty!</p>
            <button
              onClick={() => dispatch(setCartClose())}
              className='px-6 py-4 transition-all duration-100 ease-in  text-blue-400 border border-blue-400 hover:text-white  hover:bg-blue-400'
            >
              Return to shop
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className='relative overflow-scroll flex-col no-scrollbar flex flex-1 justify-between '>
            <CartItemList items={items} />
            <CartTotal showDetails={false} />
          </div>
          <button
            onClick={() => dispatch(setCartSection('CHECKOUT'))}
            className='cursor-pointer p-8 text-white text-center w-full bg-gray-700'
          >
            CHECK OUT
          </button>
        </>
      )}
    </>
  );
};

export default CartItemsSection;
