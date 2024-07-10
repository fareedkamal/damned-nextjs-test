import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Customer, CustomerAddress, LineItem, Order } from '@/graphql';
import { useSession } from '@/client/SessionProvider';
import { useEffect, useState } from 'react';
import getOrders from '@/lib/graphql/orders/query';

export function ThankYou({ orderId }: { orderId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    cart,
    customer: customerData,
    updateCart,
    fetching,
    isAuthenticated,
  } = useSession();

  const [order, setOrder] = useState<any>(null);

  const fetchOrders = async (id) => {
    const data: any = await getOrders(id);
    if (data) {
      const order = data?.orders?.nodes?.find(
        ({ databaseId }) => Number(databaseId) === Number(orderId)
      );

      setOrder(order);
      console.log(order);
    }
  };

  const customer = customerData as Customer;

  const billing = (order?.billing || {}) as CustomerAddress;
  const lineItems = (order?.lineItems?.nodes || []) as LineItem[];

  useEffect(() => {
    if (!cart || !cart.contents) {
      return;
    }
    const itemCount = cart.contents.itemCount;
    if (itemCount) {
      updateCart({
        mutation: 'emptyCart',
        input: {
          clearPersistentCart: true,
        },
      });
    }
  }, [cart]);

  useEffect(() => {
    if (customer?.id) {
      fetchOrders(Number(customer?.id));
    }
  }, [customer?.id]);

  return (
    <div>
      {order ? (
        <div className=''>
          <h2 className='mb-4 text-xl font-semibold'>Order Information:</h2>
          <div className='flex items-center'>
            <small className='font-bold'>Order Number:&nbsp;</small>
            <p className='ml-auto'>{order?.orderNumber}</p>
          </div>
          <div className='flex items-center'>
            <small className='font-bold'>Order Date:&nbsp;</small>
            <p className='ml-auto'>
              {!!order?.date &&
                new Date(order?.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
            </p>
          </div>
          <div className='flex items-center'>
            <small className='font-bold'>Customer Name:&nbsp;</small>
            <p className='ml-auto'>{`${customer?.firstName} ${customer?.lastName}`}</p>
          </div>
          <h3 className='my-4 text-lg font-semibold'>Line Items:</h3>
          <table className='w-full mb-4 table-auto'>
            <thead>
              <tr>
                <th className='px-4 py-2'>Name</th>
                <th className='px-4 py-2'>Quantity</th>
                <th className='px-4 py-2'>Price</th>
              </tr>
            </thead>
            <tbody className='text-sm'>
              {lineItems?.map((item) => (
                <tr key={item.id}>
                  <td className='px-4 py-2 border'>
                    {item.product?.node.name}
                  </td>
                  <td className='px-4 py-2 border'>{item.quantity}</td>
                  <td className='px-4 py-2 border'>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='flex flex-col items-end gap-y-4'>
            <div className='w-full lg:w-64'>
              <div className='flex items-center'>
                <small className='font-bold'>Subtotal:&nbsp;</small>
                <p className='ml-auto'>{order?.subtotal}</p>
              </div>
              <div className='flex items-center'>
                <small className='font-bold'>Discount Total:&nbsp;</small>
                <p className='ml-auto'>{order?.discountTotal}</p>
              </div>
              <div className='flex items-center'>
                <small className='font-bold'>Discount Tax:&nbsp;</small>
                <p className='ml-auto'>{order?.discountTax}</p>
              </div>
              <div className='flex items-center'>
                <small className='font-bold'>Shipping Total:&nbsp;</small>
                <p className='ml-auto'>{order?.shippingTotal}</p>
              </div>
              <div className='flex items-center'>
                <small className='font-bold'>Shipping Tax:&nbsp;</small>
                <p className='ml-auto'>{order?.shippingTax}</p>
              </div>
              <div className='flex items-center'>
                <small className='font-bold'>Total Tax:&nbsp;</small>
                <p className='ml-auto'>{order?.totalTax}</p>
              </div>
              <div className='flex items-center pb-2 border-b whitespace-nowrap'>
                <small className='font-bold'>Total Amount:&nbsp;</small>
                <p className='ml-auto'>{order?.total}</p>
              </div>
            </div>
            {/* <Link
          className='w-full lg:max-w-[16rem] px-4 py-2 rounded bg-primary text-primary-foreground text-center text-sm font-semibold whitespace-nowrap'
          href={
            !isAuthenticated
              ? `/order-status#${databaseId}`
              : `/account/orders#${databaseId}`
          }
        >
          {'View order status'}
        </Link> */}
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}
