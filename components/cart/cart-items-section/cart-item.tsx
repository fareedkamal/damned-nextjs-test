import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCartMutations } from '@woographql/react-hooks';
import { CartItem as CartItemInterface, StockStatusEnum } from '@/graphql';

import { sessionContext } from '@/client/SessionProvider';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { dispatch } from '@/redux/store';
import { setCartClose, setCartLoading } from '@/redux/slices/cart-slice';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { reloadBrowser } from '@/components/utils';

export interface CartItemProps {
  item: CartItemInterface;
  priority?: boolean;
}

export function CartItem({ item, priority }: CartItemProps) {
  const { refresh, replace } = useRouter();
  const slug = item.product?.node?.slug as string;
  const productId = item.product?.node?.databaseId as number;
  const variationId = item.variation?.node?.databaseId || undefined;
  const maxQuantity = item?.variation?.node?.stockQuantity ?? 0;
  const maxQuantityRef = useRef(maxQuantity);
  const productImageSrc = item?.variation?.node?.image?.sourceUrl ?? '';
  const productName = item?.product?.node.name ?? '';
  const productPrice = item?.total ?? '';
  const productVariation = item?.variation?.attributes
    ? item?.variation?.attributes[0]?.value
    : '';
  const productImageAlt =
    item?.variation?.node?.image?.altText ||
    `Image of ${item?.product?.node?.name}`;

  const { quantityFound, mutate, fetching } = useCartMutations(
    { productId, variationId },
    sessionContext
  );

  const [quantity, setQuantity] = useState<number>(quantityFound);
  const [value, setValue] = useState<number>(quantityFound);

  const updateQuantity = async () => {
    dispatch(setCartLoading(true));
    try {
      const cart = await mutate('updateItemQuantities', { quantity });
      console.log(cart);
    } catch (error) {
      console.log(error);
    }
    dispatch(setCartLoading(false));
  };

  const removeCartItem = async () => {
    dispatch(setCartLoading(true));
    try {
      await mutate('removeItemsFromCart', {});
    } catch (error) {
      console.log(error);
      toast.error('Cart Session Expired.');
      dispatch(setCartClose());
      reloadBrowser();
    }
    dispatch(setCartLoading(false));
  };

  const handleChange = async (e: any) => {
    const value = Number(e.target.value);
    if (value === quantity) {
      return;
    }
    if (value <= 0) {
      toast.error('Min Quantity Required');
      setValue(1);
      setQuantity(1);
      return;
    }

    dispatch(setCartLoading(true));
    try {
      await mutate('updateItemQuantities', { quantity });
    } catch (error) {
      console.log(error);
      dispatch(setCartLoading(false));
      return;
    }
    dispatch(setCartLoading(false));

    console.log(maxQuantity);
    if (value >= maxQuantity) {
      toast.error(`Stock Limit Reached. Max Quantity is ${maxQuantity}`);
      setValue(quantity);
      return;
    }
    setQuantity(value);
  };

  const decreaseQuantity = () => {
    if (quantity === 1) {
      toast.error('Min Quantity Required');
    } else {
      setQuantity((prevState) => --prevState);
    }
  };

  const increaseQuantity = async () => {
    dispatch(setCartLoading(true));
    try {
      await mutate('updateItemQuantities', { quantity });
      console.log(maxQuantity);
      if (maxQuantity === 0) {
        toast.error('Stock Limit Reached');
      } else {
        setQuantity((prevState) => ++prevState);
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(setCartLoading(false));
  };

  useEffect(() => {
    if (quantityFound !== quantity) {
      updateQuantity();
    }
  }, [quantity]);

  useEffect(() => {
    setValue(quantityFound);
  }, [quantityFound]);

  return (
    <div className='flex h-[150px] p-4 gap-4 '>
      <div className='h-full w-[30%]'>
        <Link
          href={`/product/${slug}`}
          onClick={() => dispatch(setCartClose())}
        >
          <Image
            alt={productImageAlt}
            src={productImageSrc}
            height={100}
            width={100}
            className='h-full w-full object-cover'
          />
        </Link>
      </div>

      <div className='w-[70%] h-full relative'>
        <div className=' absolute top-0 right-0'>
          <p>{productPrice}</p>
        </div>
        <IconButton
          onClick={removeCartItem}
          className='absolute  bottom-0 right-0'
        >
          <Trash2 className='h-5 w-5 hover:text-red-600' />
        </IconButton>
        <div>
          <Link
            onClick={() => dispatch(setCartClose())}
            href={`/product/${slug}`}
          >
            <p>{productName}</p>
          </Link>
          <p>{productVariation}</p>
        </div>

        <div className='absolute bottom-0 left-0 flex w-fit border border-stone-300'>
          <IconButton onClick={decreaseQuantity} className='rounded-none'>
            <Minus className='h-5 w-5 m-auto' />
          </IconButton>
          <div className='h-10 w-auto border-x border-gray-300 flex'>
            <input
              max={maxQuantity + quantity}
              min={1}
              value={value}
              disabled={fetching}
              className='h-full w-full text-center focus:outline-none'
              onChange={(e) => {
                setValue(Number(e.target.value));
              }}
              onBlur={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleChange(e);
              }}
              type='number'
            />
          </div>
          <IconButton onClick={increaseQuantity} className='rounded-none'>
            <Plus className='h-5 w-5 m-auto' />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
