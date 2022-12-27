import { Option } from 'components/Select/Select.types';
import { List } from 'models/types';

export interface UIList {
  step: number;
  token: Option | undefined;
  currency: Option | undefined;
  totalAvailableAmount: number | undefined;
  marginType: List['margin_type'];
  margin: number | undefined;
  limitMin: number | undefined;
  limitMax: number | undefined;
  bank: Option | undefined;
}

export interface StepProps {
  list: UIList;
  updateList: (t: UIList) => void;
}
