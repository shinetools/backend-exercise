import joi from 'joi';
import { Transaction } from '../../domain/models/transaction';
import { TransactionStorageError } from '../../domain/errors/transaction-storage-error';
import { BalanceComputingError } from '../../domain/errors/balance-computing-error';
import { storeTransactionUseCase } from '../../application/use-cases/store-transaction-use-case';
import { computeBalanceUseCase } from '../../application/use-cases/compute-balance-use-case';
import { transactionsRepositoryFactory } from '../providers/transactions-repository-factory';
import { bankAccountsRepositoryFactory } from '../providers/bank-accounts-repository-factory';
import logger from '../utils/logger';
import { EventSchema } from '../schemas/event-schema';

interface Event {
  eventId: string;
  payload: any;
  retry: number;
}

/**
 * A handler that will receive transaction events
 *
 * @param {object} event - The received event from the queue
 * @param {object} event.eventId - The unique id of the event
 * @param {string} event.payload - The payload of the event
 * @param {number} event.retry - The number of retries (defaults to 0)
 * @returns {boolean} false if the event needs to be retried, else true
 */
export const handle = async (event: Event) => {
  try {
    logger.info('Event received', { event });

    const sqliteTransactionsRepository = await transactionsRepositoryFactory();
    const sqliteBankAccountsRepository = await bankAccountsRepositoryFactory();
    const { value, error } = joi.object(EventSchema).validate(event);

    if (!error) {
      const transaction = new Transaction(
        event.payload.transactionId,
        event.payload.bankAccountId,
        event.payload.userId,
        event.payload.category,
        event.payload.title,
        event.payload.description,
        event.payload.type,
        event.payload.status,
        event.payload.paymentMethod,
        event.payload.currency,
        event.payload.value,
        new Date(event.payload.createdAt),
        new Date(event.payload.executedAt),
        new Date(event.payload.transactionAt),
        new Date(event.payload.updatedAt),
      );

      const transactionStorageResult = await storeTransactionUseCase(
        { transaction },
        { transactionsRepository: sqliteTransactionsRepository },
      );

      if (transactionStorageResult instanceof TransactionStorageError) {
        return false;
      }

      const balanceComputingResult = await computeBalanceUseCase(
        { transaction },
        { bankAccountsRepository: sqliteBankAccountsRepository },
      );

      if (balanceComputingResult instanceof BalanceComputingError) {
        // We should remove the transaction from the transactions table.
        return false;
      }

      return true;

      return false;
    }

    // The event is not valid.
    logger.error('Validation error in consume(...):', error);

    return false;
  } catch (error) {
    logger.error('In consume(...):', error);

    return false;
  }
};

export default handle;
