import type { BankAccountsRepository } from '../../domain/repositories/bank-accounts-repository';
import { SqliteBankAccountsRepository } from './sqlite/sqlite-bank-accounts-repository';
import getDatabase from '../utils/database';

/**
 * Selects and instantiates a source bank accounts repository.
 *
 * @returns Instantiated bank accounts repository.
 */
export async function bankAccountsRepositoryFactory(): Promise<BankAccountsRepository> {
  const database = await getDatabase();

  return new SqliteBankAccountsRepository({ database });
}
