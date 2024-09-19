import { Macro } from './Macro';

export interface Button {
  id: number;
  name: string;
  macros?: Macro[];
}