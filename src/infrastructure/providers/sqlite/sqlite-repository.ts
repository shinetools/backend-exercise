import { TransactionStorageError } from '../../../domain/errors/transaction-storage-error';
import { Transaction } from '../../../domain/models/transaction';
import { TransactionsRepository } from '../../../domain/repositories/transactions-repository';
import getDatabase from '../../../utils/database';
import logger from '../../../utils/logger';

// const database = await getDatabase();

export class SqliteRepository implements TransactionsRepository {
  // private readonly database;

  // constructor() {
  //   this.database = await getDatabase();
  // }

  async storeTransaction(
    transaction: Transaction,
  ): Promise<void | TransactionStorageError> {
    logger.info('In storeTransaction');
  }
}
