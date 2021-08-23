import { Transaction } from '../../domain/models/transaction';
import type { TransactionsRepository } from '../../domain/repositories/transactions-repository';
import { TransactionStorageError } from '../../domain/errors/transaction-storage-error';
import logger from '../../infrastructure/utils/logger';

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
  logger.info('In storeTransactionUseCase(...)');

  const transactionStorageResult =
    await transactionsRepository.storeTransaction(transaction);

  if (transactionStorageResult instanceof TransactionStorageError) {
    logger.error('In storeTransactionUseCase(...)');

    return transactionStorageResult;
  }
}
