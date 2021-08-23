import { Transaction } from '../../domain/models/transaction';
import type { BankAccountsRepository } from '../../domain/repositories/bank-accounts-repository';
import { BalanceComputingError } from '../../domain/errors/balance-computing-error';
import logger from '../../infrastructure/utils/logger';
import { TransactionStatus } from '../../domain/interfaces/transaction';

interface ComputeBalanceUseCaseInput {
  transaction: Transaction;
}

interface ComputeBalanceUseCaseDependencies {
  bankAccountsRepository: BankAccountsRepository;
}

export async function computeBalanceUseCase(
  { transaction }: ComputeBalanceUseCaseInput,
  { bankAccountsRepository }: ComputeBalanceUseCaseDependencies,
): Promise<void | BalanceComputingError> {
  logger.info('In computeBalanceUseCase(...)');

  let balanceComputingResult;

  if (transaction.status !== TransactionStatus.CANCELED) {
    const isNext = transaction.status === TransactionStatus.PENDING;

    balanceComputingResult = await bankAccountsRepository.computeBalance(
      transaction,
      isNext,
    );
  }

  if (balanceComputingResult instanceof BalanceComputingError) {
    logger.error('In computeBalanceUseCase(...)');

    return balanceComputingResult;
  }
}
