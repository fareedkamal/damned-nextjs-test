import { ArrowLeft, X } from 'lucide-react';
import { text } from '@/app/styles';
import Checkout from './checkout/checkout';
import CartTotal from '../cart-total';
import { dispatch } from '@/redux/store';
import {
  setCartClose,
  setCartLoading,
  setCartSection,
} from '@/redux/slices/cart-slice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { setDiffShipAddress } from '@/redux/slices/cart-slice';
import {
  CheckoutProvider,
  useCheckoutDetails,
} from '@/client/CheckoutProvider';
import { useRouter } from 'next/navigation';
import { sessionContext, useSession } from '@/client/SessionProvider';
import { useOtherCartMutations } from '@woographql/react-hooks';
import { useFormik } from 'formik';
import { Cart } from '@/graphql';
import { combinedSchema, onlyBillingSchema } from './checkout/helpers';
import BillingForm from './checkout/billing-form';
import ShippingForm from './checkout/shipping-form';
import toast from 'react-hot-toast';

const CheckoutSection = () => {
  const diffShipAddress = useSelector(
    (state: any) => state.cartSlice.diffShipAddress
  );
  const { push } = useRouter();
  const { billing, shipping, updateCheckoutDetails } = useCheckoutDetails();
  const { customer, updateCustomer, updateCart, cart: cartData } = useSession();
  const cart = cartData as Cart;
  const { setShippingLocale } = useOtherCartMutations<any>(sessionContext);

  const initialValues = { billing: billing, shipping: shipping };

  const handleSubmit = async (values: any) => {
    try {
      dispatch(setCartLoading(true));

      await updateCheckoutDetails({
        billing: values.billing,
        shipping: values?.shipping ?? values.billing,
      });

      await setShippingLocale({
        country: diffShipAddress
          ? values.shipping.country
          : values.billing.country,
        city: diffShipAddress ? values.shipping.city : values.billing.city,
        state: diffShipAddress ? values.shipping.state : values.billing.state,
        postcode: diffShipAddress
          ? values.shipping.postcode
          : values.billing.postcode,
      });

      await updateCart({
        mutation: 'updateItemQuantities',
        input: {
          items: [
            {
              key: cart?.contents?.nodes[0].key as string,
              quantity: cart?.contents?.nodes[0].quantity as number,
            },
          ],
        },
      });
      dispatch(setCartLoading(false));
      dispatch(setCartSection('PAYMENT'));
    } catch (error) {
      console.log(error);
      toast.error('Cart session expired.');
      dispatch(setCartClose());
      push('/shop');
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: diffShipAddress ? combinedSchema : onlyBillingSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    formik.setFormikState((prevState) => ({
      ...prevState,
      validationSchema: diffShipAddress ? combinedSchema : onlyBillingSchema,
    }));
  }, [diffShipAddress]);

  return (
    <>
      <div className='w-full border-b p-2'>
        <div className='flex gap-6 items-center'>
          <ArrowLeft
            className='w-5 h-5 cursor-pointer'
            onClick={() => dispatch(setCartSection('CART'))}
          />
          <p className={`${text.md} font-medium`}>CHECKOUT</p>
        </div>
      </div>
      <div className='relative overflow-scroll flex-col no-scrollbar flex flex-1 justify-between '>
        <div className='p-4'>
          <BillingForm formik={formik} />

          <div className='my-4 flex gap-2'>
            <input
              type='checkbox'
              checked={diffShipAddress}
              onChange={() => dispatch(setDiffShipAddress(!diffShipAddress))}
            />
            <p>Ship to a different address?</p>
          </div>

          {diffShipAddress ? <ShippingForm formik={formik} /> : null}
        </div>
      </div>
      <button
        type='submit'
        onClick={() => formik.handleSubmit()}
        //onClick={() => dispatch(setCartSection('CHECKOUT'))}
        className='cursor-pointer p-8 text-white text-center w-full bg-gray-700'
      >
        PLACE ORDER
      </button>
    </>
  );
};

export default CheckoutSection;
