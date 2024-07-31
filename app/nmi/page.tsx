import './App.css';
import PaymentForm from './PaymentForm';
import {
  CollectJSProvider,
  injectCollectJS,
} from '@lydiagoulding/react-nmi-collectjs';

const collectJS = injectCollectJS(
  'https://secure.networkmerchants.com/token/Collect.js',
  '5mN8N7-jhr55W-N22pxX-uAW2s9'
);

const NMI = () => {
  return (
    <div className='App'>
      <CollectJSProvider collectJSPromise={collectJS}>
        <PaymentForm />
      </CollectJSProvider>
    </div>
  );
};

export default NMI;
