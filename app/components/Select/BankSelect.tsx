import Select from './Select';

const options = [
  {
    id: 1,
    name: 'IRN',
    icon: 'https://www.minke.app/assets/images/core/flags.svg#india'
  },
  {
    id: 2,
    name: 'USD',
    icon: 'https://www.minke.app/assets/images/core/flags.svg#USA'
  },
  {
    id: 3,
    name: 'ARS',
    icon: 'https://www.minke.app/assets/images/core/flags.svg#ARGENTINA'
  }
];

const BankSelect = () => {
  return <Select label="Bank Name" options={options} />;
};
export default BankSelect;
