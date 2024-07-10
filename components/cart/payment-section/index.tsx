import { text } from '@/app/styles';
import { useSession } from '@/client/SessionProvider';

import CartTotal from '../cart-total';
import { dispatch } from '@/redux/store';
import { CartItem as CartItemInterface } from '@/graphql';
import {
  setCartLoading,
  setCartSection,
  setCheckoutSuccess,
} from '@/redux/slices/cart-slice';
import { ArrowLeft } from 'lucide-react';
import { useCheckoutDetails } from '@/client/CheckoutProvider';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

const PaymentSection = () => {
  const {
    customerId,
    billing,
    shipping,
    lineItems,
    shippingLines,
    coupons,
    createOrder,
  } = useCheckoutDetails();
  const { push } = useRouter();
  const [checkoutSuccess, setCheckoutSuccess] = useState<any>(null);

  const handleCheckout = async () => {
    try {
      dispatch(setCartLoading(true));
      const order = await createOrder({
        customerId,
        billing,
        shipping,
        lineItems,
        shippingLines,
        coupons,
        paymentMethod: 'cod',
        paymentMethodTitle: 'Cash on Delivery',
      });
      dispatch(setCartLoading(false));

      if (!order) {
        toast.error('Error while checking out.');
        return;
      }
      setCheckoutSuccess(true);
      push(`/order-recieved/${order.databaseId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='w-full border-b p-2'>
        <div className='flex gap-6 items-center'>
          <ArrowLeft
            className='w-5 h-5 cursor-pointer'
            onClick={() => dispatch(setCartSection('CHECKOUT'))}
          />
          <p className={`${text.md} font-medium`}>PAYMENT</p>
        </div>
      </div>

      <div className='relative overflow-scroll flex-col no-scrollbar flex flex-1 justify-between '>
        <div className='p-2'>TESTING CHECKOUT WITH CASH ON DELIVERY</div>
        <CartTotal showDetails={true} />
      </div>
      <button
        onClick={handleCheckout}
        className='cursor-pointer p-8 text-white text-center w-full bg-gray-700'
      >
        CHECKOUT
      </button>

      {checkoutSuccess ? (
        <div className='absolute bg-white z-[999]  h-full w-full flex '>
          <div className='m-auto  flex text-center gap-4 flex-col items-center justify-center'>
            <p>
              {`Thank You for your order. We're redirecting to your order page`}
            </p>
            <CircularProgress color='inherit' />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PaymentSection;
