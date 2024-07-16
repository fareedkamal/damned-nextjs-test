'use client';

import { useEffect, useState } from 'react';
import { text } from '@/app/styles';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useCartMutations, useProduct } from '@woographql/react-hooks';
import { sessionContext, useSession } from '@/client/SessionProvider';
import { getRequiredAttributes } from './helpers';
import toast from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { Cart, CartItem } from '@/graphql';

const ProductDetails = ({ product }: any) => {
  const [quantity, setQuantity] = useState(1);
  //const [selectedAttribute, setSelectedAttribute] = useState<any>(null);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [executing, setExecuting] = useState<any>(false);
  const { cart, fetching: sessionFetching } = useSession();

  const cartItems = cart?.contents?.nodes as CartItem[];
  const isInCart = cartItems?.find(
    (item: CartItem) => item.variation?.node?.id === selectedVariation?.id
  );
  const quantityLeft: any = isInCart?.variation?.node?.stockQuantity;

  // const variation = getRequiredAttributes(
  //   selectedAttribute,
  //   selectedVariation as any
  // );

  const productId = product.databaseId as number;
  const variationId = (selectedVariation?.databaseId as number) ?? undefined;

  const { fetching, mutate, quantityFound } = useCartMutations(
    {
      productId,
      variationId,
      //variation,
    },
    sessionContext
  );

  const cartButtonDisabled =
    executing ||
    selectedVariation?.stockStatus === 'OUT_OF_STOCK' ||
    !selectedVariation;

  const mutation = quantityFound ? 'updateItemQuantities' : 'addToCart';

  const addToCart = async () => {
    setExecuting(true);

    try {
      if (isInCart) {
        await mutate('updateItemQuantities', { quantity });
        if (quantityLeft === 1 || quantityLeft === null) {
          toast.error(
            `Stock Limit Reached. ${quantityLeft ?? 0} items left in stock`
          );
          setExecuting(false);
          return;
        }
      }

      await mutate(mutation, {
        quantity: mutation === 'updateItemQuantities' ? quantity + 1 : quantity,
      });
      toast.success(`${selectedVariation.name} is added to cart`);
    } catch (error) {
      console.log(error);
    }
    setExecuting(false);
  };

  useEffect(() => {
    if (quantityFound) {
      setQuantity(quantityFound);
    } else {
      setQuantity(1);
    }
  }, [quantityFound]);

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className={`${text.lg} font-normal uppercase`}>{product.name}</h1>
        <p className={`${text.lg} font-normal`}>{product.price}</p>
      </div>

      <div className='flex flex-col font-semibold'>
        <fieldset>
          {product.variations.nodes.map((option: any) => (
            <div className='flex  items-center mb-4' key={option.id}>
              <input
                id={option.databaseId}
                type='radio'
                checked={selectedVariation?.id === option.id}
                name={option.name}
                onChange={() => {
                  setSelectedVariation(option);
                  // setSelectedAttribute({
                  //   [option.attributes.nodes[0].label]:
                  //     option.attributes.nodes[0].value,
                  // });
                }}
                className='w-4 h-4 border-gray-300 focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 dark:focus:bg-stone-600 dark:bg-gray-700 dark:border-gray-600'
              />
              <label
                htmlFor={option.name}
                className='block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
              >
                <div className='flex flex-col'>
                  <span>{option?.attributes.nodes[0]?.value ?? ''}</span>
                  <span>{option.price}</span>
                </div>
              </label>
            </div>
          ))}
        </fieldset>
      </div>

      {selectedVariation?.stockStatus === 'OUT_OF_STOCK' ? (
        <div className=' flex flex-col gap-4 items-start'>
          <p>Sold Out!</p>
          <p>
            Join the waitlist to be emailed when this product becomes available
          </p>
          <TextField type='email' size='small' />
          <Button className='py-2 px-8 bg-stone-400 w-fit text-white hover:bg-stone-600'>
            ADD TO WISHLIST
          </Button>
        </div>
      ) : null}

      <LoadingButton
        onClick={addToCart}
        loading={executing}
        disabled={cartButtonDisabled}
        className='py-2 px-8 bg-stone-400 w-fit text-white hover:bg-stone-600'
      >
        ADD TO CART
      </LoadingButton>

      <div dangerouslySetInnerHTML={{ __html: product.description }} />
    </div>
  );
};

export default ProductDetails;
