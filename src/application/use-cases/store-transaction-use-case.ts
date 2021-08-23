import { Transaction } from '../../domain/models/transaction';
import type { TransactionsRepository } from '../../domain/repositories/transactions-repository';
import { TransactionStorageError } from '../../domain/errors/transaction-storage-error';

interface StoreTransactionUseCaseInput {
  transaction: Transaction;
}

interface StoreTransactionUseCaseDependencies {
  transactionsRepository: TransactionsRepository;
}

export async function storeTransactionUseCase(
  { transaction }: StoreTransactionUseCaseInput,
  { transactionsRepository }: StoreTransactionUseCaseDependencies,
): Promise<void | TransactionStorageError> {
  const res = await transactionsRepository.storeTransaction(transaction);

  if (res instanceof TransactionStorageError) {
    return res;
  }
}
