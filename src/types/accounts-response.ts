import { Account } from '@/models';

export interface AccountsResponse {
  accounts: Account[];
  totalBalance: number;
}
