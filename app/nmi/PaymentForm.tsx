import {
  useCollect,
  CardNumberInput,
  CardExpirationInput,
  CheckNameInput,
  CardCVVInput,
  CheckAccountInput,
  CheckRoutingNumberInput,
  ValidationContainer,
  ValidationContainerFields,
} from '@lydiagoulding/react-nmi-collectjs';

import { useCallback, useState } from 'react';

export default function PaymentForm() {
  const [collect, response, reset] = useCollect({
    validCss: {
      color: 'green',
      'background-color': 'cyan',
    },
  });
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      collect.startPaymentRequest();
    },
    [collect]
  );
  const [tab, setTab] = useState('credit');
  const onRestart = useCallback(
    (e) => {
      e.preventDefault();
      reset();
    },
    [reset]
  );

  return (
    <form
      style={{
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setTab('credit');
            collect.configure();
          }}
        >
          CreditCard
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setTab('check');
            collect.configure();
          }}
        >
          Checks
        </button>
      </div>
      {tab === 'credit' && (
        <>
          <ValidationContainer
            validationFields={[ValidationContainerFields.ccNumber]}
          >
            {({ isValid, errors }) => (
              <label>
                Credit Card Number
                {isValid ? (
                  <span>Valid!</span>
                ) : (
                  <ul>
                    {errors.map((error) => (
                      <li>{error.message}</li>
                    ))}
                  </ul>
                )}
                <CardNumberInput />
              </label>
            )}
          </ValidationContainer>

          <label>
            Expiration
            <CardExpirationInput />
          </label>
          <label>
            CVV
            <CardCVVInput />
          </label>
        </>
      )}
      {tab === 'check' && (
        <>
          <label>
            Routing
            <CheckNameInput />
          </label>
          <label>
            Account Number
            <CheckAccountInput />
          </label>
          <label>
            Name
            <CheckRoutingNumberInput />
          </label>
        </>
      )}
      <button onClick={onSubmit}>Submit</button>
      <div>{JSON.stringify(response)}</div>
      <button onClick={onRestart}>Restart</button>
    </form>
  );
}
