import PinCodeScreen from '../../components/pinCode/PinCodeScreen';

export default function PinCode() {
  return (
    <div>
      <PinCodeScreen
        onSuccess={() => console.log('Pin entered successfully')}
        onCancel={() => console.log('Pin entry cancelled')}
      />
    </div>
  );
}