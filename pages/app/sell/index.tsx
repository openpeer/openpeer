import Steps from '../../../components/Steps';
import Button from '../../../components/Button/Button';
import TokenSelect from '../../../components/Select/TokenSelect';
import CurrencySelect from '../../../components/Select/CurrencySelect';

const SellPage = () => {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-16">
        <h1 className="text-2xl font-semibold text-gray-900">Crypto Listing</h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Steps currentStep="1" />
        <TokenSelect />
        <CurrencySelect />
        <Button title="Proceed" />
      </div>
    </div>
  );
};

export default SellPage;
