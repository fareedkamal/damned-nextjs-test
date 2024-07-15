'use client';

import { useSession } from '@/client/SessionProvider';
import { Customer, fetchOrders, Order } from '@/graphql';
import { Loader } from '@/components/utils';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { dispatch } from '@/redux/store';
import { setOrders } from '@/redux/slices/orders-slice';

const Orders = () => {
  const { customer } = useSession();
  const orders = useSelector((state: any) => state.ordersSlice.orders);

  console.log(orders);

  const fetchData = async (id: number) => {
    const data: any = await fetchOrders({ where: { customerId: id } });
    if (data) {
      console.log(data);
      dispatch(setOrders(data?.nodes));
    }
  };

  useEffect(() => {
    if (customer && !orders) {
      fetchData(Number(customer?.databaseId));
    }
  }, [customer, orders]);

  return (
    <div className='w-full'>
      {!orders ? (
        <Loader className='w-full mt-4' text='Fetching Orders...' />
      ) : (
        <div className='overflow-x-scroll no-scrollbar'>
          <table className='w-full border border-gray-300 '>
            <thead className='border-b [&>td]:p-4'>
              <td>Order</td>
              <td>Date</td>
              <td>Status</td>
              <td>Total</td>
              <td>Actions</td>
            </thead>
            <tbody>
              {orders?.map((order: Order) => (
                <tr key={order.databaseId} className='[&>td]:p-4'>
                  <td className='font-bold'>
                    <Link href={`/my-account/orders/${order.orderNumber}`}>
                      {order.orderNumber}
                    </Link>
                  </td>

                  <td>{new Date(order.date as string).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>{order.total}</td>
                  <td className='font-bold'>
                    <Link href={`/my-account/orders/${order.orderNumber}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
