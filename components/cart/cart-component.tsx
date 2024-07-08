import { ArrowLeft, X } from 'lucide-react';
import { text } from '@/app/styles';
import { dispatch } from '@/redux/store';
import { setCartClose } from '@/redux/slices/cart-slice';
import CartItemList from './cart-items-list';
import CartTotal from './cart-total';
import { useState } from 'react';
import Checkout from './checkout/checkout';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { useSession } from '@/client/SessionProvider';
import { CartItem as CartItemInterface } from '@/graphql';

const CartComponent = () => {
  const { cart } = useSession();
  const items = (cart?.contents?.nodes || []) as CartItemInterface[];
  const [checkout, setCheckout] = useState(false);
  const cartLoading = useSelector((state: any) => state.cartSlice.cartLoading);

  return (
    <div className='flex flex-col w-full h-full bg-white'>
      <div className='w-full flex justify-between border-b'>
        <div className={`${text.md} font-medium p-2`}>
          {checkout ? (
            <div className='flex gap-4'>
              <ArrowLeft
                className='cursor-pointer'
                onClick={() => setCheckout(false)}
              />
              CHECKOUT
            </div>
          ) : (
            <div>CART</div>
          )}
        </div>
        <div
          onClick={() => dispatch(setCartClose())}
          className='border-x p-2 cursor-pointer'
        >
          <X />
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
            {cartLoading ? (
              <div className='absolute bg-[#ffffff75] z-[999] h-full w-full flex'>
                <CircularProgress className='m-auto' color='inherit' />
              </div>
            ) : null}
            {!checkout ? <CartItemList items={items} /> : <Checkout />}
            <CartTotal showDetails={checkout} />
          </div>

          <button
            disabled={cartLoading}
            onClick={() => setCheckout(true)}
            className='cursor-pointer p-8 text-white text-center w-full bg-gray-700'
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartComponent;
