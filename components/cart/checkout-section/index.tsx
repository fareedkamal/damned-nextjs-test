import { ArrowLeft, X } from 'lucide-react';
import { text } from '@/app/styles';
import CartTotal from '../cart-total';
import { dispatch } from '@/redux/store';
import {
  setCartClose,
  setCartLoading,
  setCartSection,
  setPaymentMethod,
} from '@/redux/slices/cart-slice';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { setDiffShipAddress } from '@/redux/slices/cart-slice';
import {
  CheckoutProvider,
  useCheckoutDetails,
} from '@/client/CheckoutProvider';
import { useRouter } from 'next/navigation';
import { useSession } from '@/client/SessionProvider';
import { useFormik } from 'formik';
import { Cart, CountriesEnum } from '@/graphql';
import { combinedSchema, onlyBillingSchema } from './checkout/helpers';
import BillingForm from './checkout/billing-form';
import ShippingForm from './checkout/shipping-form';
import toast from 'react-hot-toast';
import { Button, Divider, FormControl, MenuItem, Select } from '@mui/material';
import { Loader, reloadBrowser } from '@/components/utils';

const CheckoutSection = () => {
  //-------------------->     CONSTANTS & HOOKS
  //-------------------->
  //-------------------->

  const [validnumber, setValidNumber] = useState('');
  const [validexpiration, setValidExpiration] = useState('');
  const [validcvv, setValidCvv] = useState('');

  const cartLoading = useSelector((state: any) => state.cartSlice.cartLoading);

  const paymentMethods = [
    { value: 'nmi', name: 'NMI' },
    // { value: 'sezzle', name: 'Sezzle' },
    { value: 'cod', name: 'Cash on Delivery' },
  ];
  const { push } = useRouter();
  const [checkoutSuccess, setCheckoutSuccess] = useState<any>(null);
  const diffShipAddress = useSelector(
    (state: any) => state.cartSlice.diffShipAddress
  );
  const paymentMethod = useSelector(
    (state: any) => state.cartSlice.paymentMethod
  );
  const { cart: cartData } = useSession();
  const cart = cartData as Cart;

  const {
    customerId,
    billing,
    shipping,
    lineItems,
    shippingLines,
    coupons,
    createOrder,
    updateCheckoutDetails,
  } = useCheckoutDetails();

  const initialValues = { billing: billing, shipping: shipping };
  const formikValues = useRef(initialValues);
  //------------------> FUNCTIONS
  //-------------------->
  //-------------------->
  //-------------------->
  //-------------------->
  //-------------------->

  const changePaymentMethod = (e: any) => {
    dispatch(setPaymentMethod(e.target.value));
  };

  const handleFormikSubmit = () => {
    //setValues(values);
    if (paymentMethod === '') {
      toast.error('Please choose a payment method.');
      formik.setSubmitting(false);
    } else if (paymentMethod === 'nmi') {
      if (typeof window !== 'undefined') {
        window.CollectJS.startPaymentRequest();
      }
      //handleSubmitNMI();
    } else if (paymentMethod === 'cod') {
      handleSubmit();
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: diffShipAddress ? combinedSchema : onlyBillingSchema,
    onSubmit: (values) => {
      handleFormikSubmit(values);
    },
  });

  const handleSubmit = async () => {
    dispatch(setCartLoading(true));
    try {
      const values = formikValues.current;

      // console.log(customerId);
      // console.log(values);
      // dispatch(setCartLoading(false));
      // return;

      let detialsUpdated;
      if (diffShipAddress) {
        detialsUpdated = await updateCheckoutDetails({
          billing: values.billing,
          shipping: values.shipping,
        });
      } else {
        detialsUpdated = await updateCheckoutDetails({
          billing: values.billing,
        });
      }

      if (!detialsUpdated) {
        console.log(detialsUpdated);
        toast.error('Error while updating checkout details.');
        reloadBrowser();
        return;
      }

      const selectedPaymentMethod = paymentMethods.find(
        (item) => item.value === paymentMethod
      );

      const payload: any = {
        customerId,
        billing: values.billing,
        shipping: values.shipping,
        lineItems,
        shippingLines,
        coupons,
        paymentMethodTitle: selectedPaymentMethod?.name ?? '',
      };

      const order = await createOrder(payload);
      if (!order) {
        console.log(order);
        toast.error('Error while creating order.');
        reloadBrowser();
        return;
      }

      setCheckoutSuccess(true);

      setTimeout(() => {
        push(`/order-recieved/${order.orderNumber}?key=${order.orderKey}`);
        dispatch(setCartClose());
        dispatch(setCartSection('CART'));
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error('Cart Session Expired');
      reloadBrowser();
    }
    dispatch(setCartLoading(false));
  };

  //-----------------> USE EFFECTS ------------------------------>
  //-------------------->
  //-------------------->

  useEffect(() => {
    formikValues.current = formik.values;
  }, [formik.values]);

  useEffect(() => {
    if (
      paymentMethod === 'nmi' &&
      cart?.total &&
      typeof window !== 'undefined'
    ) {
      window.CollectJS.configure({
        price: cart?.total ?? '',
        variant: 'inline',
        currency: 'USD',
        country: 'US',
        customCss: {
          border: '1px solid #d6d3d1',
          padding: '20px',
          'border-radius': '4px',
          'font-size': '20px',
          'font-family': 'Montserrat',
        },
        invalidCss: {
          border: '1px solid red',
        },
        validCss: {
          'background-color': '#d0ffd0',
        },
        // placeholderCss: {
        //   color: 'green',
        //   'background-color': '#687C8D',
        // },
        // focusCss: {
        //   border: '1px solid blue',
        // },
        fields: {
          ccnumber: {
            selector: '#ccnumber',
            title: 'Card Number',
            placeholder: '0000 0000 0000 0000',
          },
          ccexp: {
            selector: '#ccexp',
            title: 'Card Expiration',
            placeholder: 'MM / YY',
          },
          cvv: {
            // display: 'show',
            selector: '#cvv',
            title: 'CVV Code',
            placeholder: 'CVV',
          },
        },
        validationCallback: (field, status, message) => {
          if (!status) {
            const m = field + ' is invalid: ' + message;
            if (field === 'ccnumber') {
              setValidNumber(message);
            }
            if (field === 'ccexp') {
              setValidExpiration(message);
            }
            if (field === 'cvv') {
              setValidCvv(message);
            }
          } else {
            if (field === 'ccnumber') {
              setValidNumber('');
            }
            if (field === 'ccexp') {
              setValidExpiration('');
            }
            if (field === 'cvv') {
              setValidCvv('');
            }
          }
        },

        // timeoutDuration: 2000,
        // timeoutCallback: () => {
        //   console.log('timeout callback');
        //   formik.setSubmitting(false);
        //   // console.log(
        //   //   "The tokenization didn't respond in the expected timeframe.  This could be due to an invalid or incomplete field or poor connectivity"
        //   // );
        //   //setAlertMessage(message);
        // },

        callback: (token: any) => {
          console.log(token);
          if (!token) {
            toast.error('Transaction failed. Please try again.');
            return;
          }
          handleSubmit();
        },
      });
    }
  }, [paymentMethod, cart?.total]);

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
        <div className='p-4 flex flex-col gap-8'>
          <BillingForm formik={formik} />

          <div className='flex gap-2'>
            <input
              type='checkbox'
              checked={diffShipAddress}
              onChange={() => dispatch(setDiffShipAddress(!diffShipAddress))}
            />
            <p>Ship to a different address?</p>
          </div>

          {diffShipAddress ? <ShippingForm formik={formik} /> : null}
        </div>

        <Divider sx={{ my: 1 }} />

        <div className='p-4'>
          <p className='mb-2 font-bold'>Select Payment Method</p>
          <FormControl fullWidth>
            <Select
              size='small'
              value={paymentMethod}
              onChange={changePaymentMethod}
            >
              {paymentMethods.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {paymentMethod === 'nmi' ? (
            <div className='mt-4'>
              <div className='mb-2'>
                <div id='ccnumber' />
                {validnumber && (
                  <div className='text-red-600 text-[12px]'>{validnumber}</div>
                )}
              </div>

              <div className='flex justify-between gap-4'>
                <div className='w-full'>
                  <div id='ccexp' />
                  {validexpiration && (
                    <div className='text-red-600 text-[12px]'>
                      {validexpiration}
                    </div>
                  )}
                </div>

                <div className='w-full'>
                  <div id='cvv' />
                  {validcvv && (
                    <div className='text-red-600 text-[12px]'>{validcvv}</div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <CartTotal showDetails={true} />
      </div>

      <Button
        type='submit'
        disabled={cartLoading}
        onClick={() => formik.handleSubmit()}
        className='py-8 bg-stone-500 w-full rounded-none text-white hover:bg-stone-600'
      >
        {`Place Order - $${cart?.total}`}
      </Button>

      {checkoutSuccess ? (
        <div className='absolute bg-white z-[999] h-full w-full flex '>
          <div className='m-auto p-4 text-center'>
            <Loader />
            <p>
              {`Thank You for your order. We're redirecting to your order page`}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CheckoutSection;
