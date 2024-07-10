'use client';

import { useState, useEffect } from 'react';
import { fetchProducts } from '@/graphql';
import ProductsList from './index';
import { init } from '@graphql-codegen/cli';
import { CircularProgress } from '@mui/material';
import getOrders from '@/lib/graphql/orders/query';

const Products = ({
  id,
  showPagination,
  search,
}: {
  id?: number | undefined;
  showPagination?: Boolean | undefined;
  search?: string | undefined;
}) => {
  const [products, setProducts] = useState<any>(null);

  const fetchData = async (id: number) => {
    const { nodes: initialProducts } = await fetchProducts({
      first: 30,
      where: { categoryId: id },
    });
    if (initialProducts) {
      setProducts(initialProducts);
    }
  };

  const fetchQuery = async (query: string) => {
    const { nodes: initialProducts } = await fetchProducts({
      first: 30,
      where: { search: query },
    });
    if (initialProducts) {
      setProducts(initialProducts);
    }
  };

  useEffect(() => {
    if (!products && id) {
      fetchData(id);
    }
    if (search) {
      fetchQuery(search);
    }
  }, [id, search]);

  return (
    <>
      {products ? (
        <ProductsList data={products} showPagination={showPagination} />
      ) : (
        <div className='flex w-full items-center h-[500px] justify-center'>
          <div className='flex w-fit items-center gap-2'>
            <CircularProgress color='inherit' />
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
