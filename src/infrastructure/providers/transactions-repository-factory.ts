import type { TransactionsRepository } from '../../domain/repositories/transactions-repository';
import { SqliteTransactionsRepository } from './sqlite/sqlite-transactions-repository';
import getDatabase from '../utils/database';

/**
 * Selects and instantiates a source transactions repository.
 *
 * @returns Instantiated transactions repository.
 */
export async function transactionsRepositoryFactory(): Promise<TransactionsRepository> {
  const database = await getDatabase();

  return new SqliteTransactionsRepository({ database });
}
