import type { Database } from 'sqlite';
import type { Transaction } from '../../../domain/models/transaction';
import type { BankAccountsRepository } from '../../../domain/repositories/bank-accounts-repository';
import { BalanceComputingError } from '../../../domain/errors/balance-computing-error';
import logger from '../../utils/logger';
import { SQLITE_BANK_ACCOUNTS_TABLE_NAME } from '../../contants';

interface SqliteRepositoryConstructorInput {
  database: Database;
}

export class SqliteBankAccountsRepository implements BankAccountsRepository {
  private readonly database;

  private readonly tableName;

  constructor({ database }: SqliteRepositoryConstructorInput) {
    this.database = database;
    this.tableName = SQLITE_BANK_ACCOUNTS_TABLE_NAME;
  }

  async computeBalance(
    transaction: Transaction,
    isNext: boolean,
  ): Promise<void | BalanceComputingError> {
    try {
      logger.info('In computeBalance(...)');

      await this.database.exec(
        `CREATE TABLE IF NOT EXISTS ${this.tableName} (
          bank_account_id TEXT PRIMARY NULL,
          user_id TEXT NOT NULL,
          balance INTEGER NOT NULL,
          next_balance INTEGER NOT NULL
        )`,
      );

      const bankAccount = await this.database.get(
        `SELECT balance, next_balance FROM ${this.tableName} WHERE bank_account_id="${transaction.bankAccountId}"`,
      );

      if (isNext) {
        // Update next balance
        await this.database.exec('UPDATE NEXT BALANCE QUERY');
      } else {
        // Update current balance
        await this.database.exec('UPDATE BALANCE QUERY');
      }
    } catch (error) {
      logger.error(error);

      return new BalanceComputingError();
    }
  }
}
