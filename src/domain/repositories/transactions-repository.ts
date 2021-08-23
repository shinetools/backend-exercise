import type { Transaction } from '../models/transaction';
import type { TransactionStorageError } from '../errors/transaction-storage-error';

export interface TransactionsRepository {
  storeTransaction(
    transaction: Transaction,
  ): Promise<void | TransactionStorageError>;
}
