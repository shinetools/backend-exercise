import type { Transaction } from '../models/transaction';
import type { BalanceComputingError } from '../errors/balance-computing-error';

export interface BankAccountsRepository {
  computeBalance(
    transaction: Transaction,
    isNext: boolean,
  ): Promise<void | BalanceComputingError>;
}
