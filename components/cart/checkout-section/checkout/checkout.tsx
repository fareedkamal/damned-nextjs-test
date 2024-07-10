import { useState } from 'react';
import BillingForm from './billing-form';
import ShippingForm from './shipping-form';
import { useSelector } from 'react-redux';
import { dispatch } from '@/redux/store';
import { setDiffShipAddress } from '@/redux/slices/cart-slice';
import {
  CheckoutProvider,
  useCheckoutDetails,
} from '@/client/CheckoutProvider';
import { useRouter } from 'next/navigation';
import { sessionContext, useSession } from '@/client/SessionProvider';
import { useOtherCartMutations } from '@woographql/react-hooks';
import { billingSchema, combinedSchema } from './helpers';
import { useFormik } from 'formik';
import { Cart } from '@/graphql';

const Checkout = () => {
  const diffShipAddress = useSelector(
    (state: any) => state.cartSlice.diffShipAddress
  );
  const { push } = useRouter();
  const { billing, shipping, updateCheckoutDetails } = useCheckoutDetails();
  const { customer, updateCustomer, updateCart, cart: cartData } = useSession();
  const cart = cartData as Cart;
  const { setShippingLocale } = useOtherCartMutations<any>(sessionContext);

  const initialValues = { billing: billing, shipping: shipping };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: combinedSchema,
    onSubmit: (values) => {
      console.log(values);
      // handle form submission
      //login(values);
    },
  });

  return (
    <CheckoutProvider>
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

        {diffShipAddress ? <ShippingForm /> : null}
      </div>
    </CheckoutProvider>
  );
};

export default Checkout;
