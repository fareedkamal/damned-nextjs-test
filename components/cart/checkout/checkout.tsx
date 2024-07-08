import { useState } from 'react';
import BillingForm from './billing-form';
import ShippingForm from './shipping-form';

const Checkout = () => {
  const [differentShippingAddress, setDifferentShippingAddress] =
    useState(false);

  return (
    <div className='p-4'>
      <BillingForm />

      <div className='my-4 flex gap-2'>
        <input
          type='checkbox'
          checked={differentShippingAddress}
          onChange={() =>
            setDifferentShippingAddress(!differentShippingAddress)
          }
        />
        <p>Ship to a different address?</p>
      </div>

      {differentShippingAddress ? <ShippingForm /> : null}
    </div>
  );
};

export default Checkout;
