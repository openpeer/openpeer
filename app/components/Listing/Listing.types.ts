import { Option } from 'components/Select/Select.types';
import { List } from 'models/types';

export interface UIPaymentMethod {
  id: number | undefined;
  account_name: string;
  account_number: string;
  bank: Option | undefined;
}

export interface UIList {
  step: number;
  token: Option | undefined;
  currency: Option | undefined;
  totalAvailableAmount: number | undefined;
  marginType: List['margin_type'];
  margin: number | undefined;
  limitMin: number | undefined;
  limitMax: number | undefined;
  paymentMethod: UIPaymentMethod | undefined;
}

export interface StepProps {
  list: UIList;
  updateList: (t: UIList) => void;
}
