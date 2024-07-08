'use client';

import { useEffect, useState } from 'react';
import { ProductInfo } from '@/lib/graphql/type';
import { text } from '@/app/styles';
import { CircularProgress, TextField } from '@mui/material';
import classNames from 'classnames';
import { useCartMutations, useProduct } from '@woographql/react-hooks';
import { sessionContext } from '@/client/SessionProvider';
import { Product } from '@/graphql';
import { getRequiredAttributes } from './helpers';
import toast from 'react-hot-toast';

interface ProductDetailsProps {
  product: any;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedAttribute, setSelectedAttribute] = useState<any>(null);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [executing, setExecuting] = useState<any>(false);

  const variation = getRequiredAttributes(
    selectedAttribute,
    selectedVariation as any
  );

  const { fetching, mutate, quantityFound } = useCartMutations(
    {
      productId: product.databaseId,
      variationId: selectedVariation?.databaseId ?? undefined,
      variation,
    },
    sessionContext
  );

  const cartButtonDisabled =
    fetching ||
    executing ||
    selectedVariation?.stockStatus === 'OUT_OF_STOCK' ||
    !selectedVariation;

  const mutation = quantityFound ? 'updateItemQuantities' : 'addToCart';

  const addToCart = async () => {
    try {
      setExecuting(true);
      const cart = await mutate(mutation, {
        quantity: mutation === 'updateItemQuantities' ? quantity + 1 : quantity,
      });
      setExecuting(false);

      if (!cart) {
        toast.error('Error while adding to cart');
      }

      if (mutation === 'addToCart') {
        toast.success('Added to cart');
      } else {
        toast.success('Cart updated');
      }
    } catch (error) {
      console.log('Error while adding to cart');
    }
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
                  setSelectedAttribute({
                    [option.attributes.nodes[0].label]:
                      option.attributes.nodes[0].value,
                  });
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
          <button className='px-5 py-2 bg-stone-400 text-white '>
            JOIN WAITLIST
          </button>
        </div>
      ) : null}

      <button
        className={classNames(
          'text-white px-8 py-4 w-[150px] text-nowrap bg-stone-400 flex items-center justify-center hover:bg-stone-300 focus:outline-none',
          {
            'cursor-not-allowed': cartButtonDisabled,
          }
        )}
        onClick={addToCart}
        disabled={cartButtonDisabled}
      >
        {executing ? (
          <CircularProgress sx={{ fontSize: 5 }} color='inherit' />
        ) : (
          'ADD TO CART'
        )}
      </button>

      <div dangerouslySetInnerHTML={{ __html: product.description }} />
    </div>
  );
};

export default ProductDetails;
