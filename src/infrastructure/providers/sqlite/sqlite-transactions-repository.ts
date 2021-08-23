import type { Database } from 'sqlite';
import type { Transaction } from '../../../domain/models/transaction';
import type { TransactionsRepository } from '../../../domain/repositories/transactions-repository';
import { TransactionStorageError } from '../../../domain/errors/transaction-storage-error';
import logger from '../../utils/logger';
import { SQLITE_TRANSACTIONS_TABLE_NAME } from '../../contants';

interface SqliteRepositoryConstructorInput {
  database: Database;
}

export class SqliteTransactionsRepository implements TransactionsRepository {
  private readonly database;

  private readonly tableName;

  constructor({ database }: SqliteRepositoryConstructorInput) {
    this.database = database;
    this.tableName = SQLITE_TRANSACTIONS_TABLE_NAME;
  }

  async storeTransaction(
    transaction: Transaction,
  ): Promise<void | TransactionStorageError> {
    try {
      logger.info('In storeTransaction(...)');

      await this.database.exec(
        `CREATE TABLE IF NOT EXISTS ${this.tableName} (
          transaction_id TEXT PRIMARY KEY,
          bank_account_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          category TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          type TEXT NOT NULL,
          status TEXT NOT NULL,
          paymentMethod TEXT NOT NULL,
          currency TEXT NOT NULL,
          value INTEGER NOT NULL,
          created_at TEXT NOT NULL,
          executed_at TEXT NOT NULL,
          transaction_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )`,
      );

      await this.database.exec(`INSERT INTO ${this.tableName} VALUES (
        "${transaction.transactionId}",
        "${transaction.bankAccountId}",
        "${transaction.userId}",
        "${transaction.category}",
        "${transaction.title}",
        "${transaction.description}",
        "${transaction.type}",
        "${transaction.status}",
        "${transaction.paymentMethod}",
        "${transaction.currency}",
        ${transaction.value},
        "${transaction.createdAt.toISOString()}",
        "${transaction.updatedAt.toISOString()}",
        "${transaction.transactionAt.toISOString()}",
        "${transaction.updatedAt.toISOString()}"
      )`);
    } catch (error) {
      logger.error(error);

      return new TransactionStorageError();
    }
  }
}
