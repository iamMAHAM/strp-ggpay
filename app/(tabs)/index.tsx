import {
  PlatformPay,
  PlatformPayButton,
  StripeProvider,
  usePlatformPay,
} from '@stripe/stripe-react-native';
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

const fetchKey = () => Promise.resolve('publishable_key');

function App() {
  const [publishableKey, setPublishableKey] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  const fetchPublishableKey = async () => {
    const key = await fetchKey(); // fetch key from your server here
    setPublishableKey(key);
  };

  const { isPlatformPaySupported } = usePlatformPay();

  useEffect(() => {
    (async function () {
      const isAvailable = await isPlatformPaySupported({
        googlePay: { testEnv: true },
      }); // always false in android
      setIsSupported(isAvailable);
    })();
  }, []);

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  const pay = async () => {
    console.log('pay');
  };

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier='merchant.identifier' // required for Apple Pay
      urlScheme='your-url-scheme' // required for 3D Secure and bank redirects
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {isSupported ? (
          <PlatformPayButton
            type={PlatformPay.ButtonType.Pay}
            onPress={pay}
            style={{
              width: '100%',
              height: 50,
            }}
          />
        ) : (
          <Text style={{ fontSize: 22 }}>Plateform pay is not supported</Text>
        )}
      </View>
    </StripeProvider>
  );
}
export default App;
