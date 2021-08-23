import joi from 'joi';
import logger from '../utils/logger';
import { Transaction } from '../domain/models/transaction';
import { storeTransactionUseCase } from '../application/use-cases/store-transaction-use-case';
import { SqliteRepository } from '../infrastructure/providers/sqlite/sqlite-repository';
import { EventSchema } from '../schemas/event-schema';

interface Event {
  eventId: string;
  payload: any;
  retry: number;
}

const sqliteRepository = new SqliteRepository();

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
    const { value, error } = joi.object(EventSchema).validate(event);

    if (!error) {
      logger.info('Event received', { event });

      const transaction = new Transaction(
        event.payload.bankAccountId,
        event.payload.userId,
        event.payload.transactionId,
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

      await storeTransactionUseCase(
        { transaction },
        { transactionsRepository: sqliteRepository },
      );

      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
};

export default handle;
