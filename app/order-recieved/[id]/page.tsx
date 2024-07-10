import { ThankYou } from '@/client/ThankYou';
const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <div className=' w-full px-[30px] py-[2em] md:py-[4em] 2xl:w-[1440px] m-auto'>
      <ThankYou orderId={id} />
    </div>
  );
};

export default Page;
