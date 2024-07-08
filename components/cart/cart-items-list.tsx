import { useSession } from '@/client/SessionProvider';
import { CartItem } from './cart-item';
import { CartItem as CartItemInterface } from '@/graphql';
import { dispatch } from '@/redux/store';
import { setCartClose } from '@/redux/slices/cart-slice';

const CartItemList = ({ items }: any) => {
  return (
    <div>
      {items.length === 0 && (
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
      )}

      {items.map((item: any) => (
        <CartItem key={item.key} item={item} />
      ))}
    </div>
  );
};

export default CartItemList;
