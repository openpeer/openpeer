import Select from './Select';

const options = [
  {
    id: 1,
    name: 'USDC',
    icon:
      'https://www.minke.app/assets/images/core/coins.svg#usdc',
  },
  {
    id: 2,
    name: 'USDT',
    icon:
      'https://www.minke.app/assets/images/core/coins.svg#usdt',
  },
  {
    id: 3,
    name: 'BUSD',
    icon:
      'https://www.minke.app/assets/images/core/coins.svg#busd',
  },
]

const TokenSelect = () => {
  return(
    <Select label='Choose token to list' options={options} />
  );
}
export default TokenSelect;