import React from 'react';
import { useFormik } from 'formik';

import { useSession } from '@/client/SessionProvider';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import toast from 'react-hot-toast';
import { useCheckoutDetails } from '@/client/CheckoutProvider';
import { useCountries } from '@/hooks/useCountries';
import { CountriesEnum } from '@/graphql';
import { billingSchema, shippingSchema } from './helpers';

const ShippingForm = () => {
  const { shipping, updateCheckoutDetails } = useCheckoutDetails();

  const formik = useFormik({
    initialValues: shipping,
    validationSchema: shippingSchema,

    onSubmit: (values) => {
      console.log(values);
      // handle form submission
      //login(values);
    },
  });

  const shippingCountry = formik.values.country as CountriesEnum;

  const { countries: shippingCountries, states: shippingStates } =
    useCountries(shippingCountry);

  // const handleSubmit = async (values: any) => {
  //   const customer = await login({
  //     mutation: 'registerCustomer',
  //     input: {
  //       username: values.email,
  //       email: values.email,
  //       password: values.password,
  //       firstName: values.firstName,
  //       lastName: values.lastName,
  //     },
  //   });

  //   if (!!customer?.id && customer.id !== 'guest') {
  //     toast.success('You have registered successfully');
  //   } else {
  //     toast.error(
  //       (customer || 'Registration failed. Please try again.') as string
  //     );

  //     formik.resetForm();
  //   }
  // };

  return (
    <form onSubmit={formik.handleSubmit} className=' flex flex-col gap-4'>
      <div>BILLING DETAILS</div>
      <div>
        <label htmlFor='firstName'>First Name</label>
        <TextField
          fullWidth
          size='small'
          variant='outlined'
          name='firstName'
          id='firstName'
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />
      </div>

      <div>
        <label htmlFor='lastName'>Last Name</label>
        <TextField
          fullWidth
          variant='outlined'
          name='lastName'
          id='lastName'
          size='small'
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
      </div>

      <FormControl fullWidth size='small'>
        <label htmlFor='country'>Country / Region</label>
        <Select
          sx={{
            '.MuiMenu-paper': {
              maxHeight: '200px',
            },
          }}
          id='country'
          name='country'
          value={formik.values.country}
          onChange={formik.handleChange}
        >
          {shippingCountries.map(({ code, name }) => (
            <MenuItem value={code} key={code}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size='small'>
        <label htmlFor='state'>State</label>
        <Select
          sx={{
            '.MuiMenu-paper': {
              maxHeight: '200px',
            },
          }}
          id='state'
          name='state'
          value={formik.values.state}
          onChange={formik.handleChange}
        >
          {shippingStates.map(({ code, name }) => (
            <MenuItem value={code} key={code}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className='flex flex-col gap-4'>
        <label htmlFor='address1'>Street Address</label>
        <TextField
          fullWidth
          placeholder='House number and street name'
          variant='outlined'
          name='address1'
          id='address1'
          size='small'
          value={formik.values.address1}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.address1 && Boolean(formik.errors.address1)}
          helperText={formik.touched.address1 && formik.errors.address1}
        />
        <TextField
          fullWidth
          variant='outlined'
          placeholder='Apartment, suite, unit, etc. (optional)'
          name='address2'
          id='address2'
          size='small'
          value={formik.values.address2}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.address2 && Boolean(formik.errors.address2)}
          helperText={formik.touched.address2 && formik.errors.address2}
        />
      </div>

      <div>
        <label htmlFor='city'>Town / City</label>
        <TextField
          fullWidth
          variant='outlined'
          name='city'
          id='city'
          size='small'
          value={formik.values.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.city && Boolean(formik.errors.city)}
          helperText={formik.touched.city && formik.errors.city}
        />
      </div>

      <div>
        <label htmlFor='postcode'>ZIP Code</label>
        <TextField
          fullWidth
          variant='outlined'
          name='postcode'
          id='postcode'
          size='small'
          value={formik.values.postcode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.postcode && Boolean(formik.errors.postcode)}
          helperText={formik.touched.postcode && formik.errors.postcode}
        />
      </div>
    </form>
  );
};

export default ShippingForm;
