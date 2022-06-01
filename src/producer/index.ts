// DO NOT EDIT THIS FILE
import Chance from 'chance';

const chance = Chance();

const TRANSACTION_TYPES = ['PAYIN', 'PAYOUT'];
const TRANSACTION_CATEGORIES = [
  'DEFAULT',
  'BANKING',
  'CASH',
  'CONTRIBUTIONS',
  'EQUIPMENT',
  'FOOD',
  'HOTEL',
  'LEGAL',
  'LOAN',
  'MAINTENANCE',
  'MISC',
  'PERSONAL',
  'RENT',
  'SERVICES',
  'TAX',
  'TELECOM',
  'ALCOOL_TOBACCO',
  'TRANSPORTATION',
  'UTILITIES',
  'VEHICLE',
  'BETTING',
];
const TRANSACTION_STATUSES = ['CANCELED', 'PENDING', 'VALIDATED'];
const PAYMENT_METHODS = ['CARD', 'CHECK', 'DIRECT_DEBIT', 'TRANSFER'];

const MAX_BANK_ACCOUNTS = 10;
const TWELVE_HOURS_IN_MS = 12 * 60 * 60 * 1000;
const ONE_MINUTE_IN_MS = 60 * 1000;

interface BankAccountUserIdPair {
  bankAccountId: string;
  userId: string;
}

const getBankAccounts = (
  number: number = MAX_BANK_ACCOUNTS,
): BankAccountUserIdPair[] => {
  const bankAccounts = [];
  for (let index = 0; index < number; index += 1) {
    bankAccounts.push({ bankAccountId: chance.guid(), userId: chance.guid() });
  }
  return bankAccounts;
};

const generateRandomTransaction = (bankAccounts: BankAccountUserIdPair[]) => {
  const transactionStatus = chance.weighted(
    [chance.pickone(TRANSACTION_STATUSES), 'BAD_STATUS'],
    [100, 2],
  );
  const transactionType = chance.weighted(
    [chance.pickone(TRANSACTION_TYPES), 'BAD_TYPE'],
    [100, 1],
  );
  const transactionAt = chance.timestamp();
  const createdAt = chance.timestamp();
  const bankAccount = chance.pickone(bankAccounts);

  const transaction = {
    bankAccountId: bankAccount.bankAccountId,
    category: chance.pickone(TRANSACTION_CATEGORIES),
    userId: bankAccount.userId,
    createdAt: new Date(createdAt).toISOString(),
    currency: 'EUR',
    description: chance.sentence({ words: 10 }),
    executedAt:
      ['VALIDATED', 'CANCELED'].includes(transactionStatus)
        ? new Date(
          transactionAt + chance.integer({ min: 0, max: 10000 }),
        ).toISOString()
        : null,
    paymentMethod: chance.pickone(PAYMENT_METHODS),
    status: transactionStatus,
    title: chance.sentence({ words: 3 }),
    transactionAt: new Date(transactionAt).toISOString(),
    transactionId: chance.guid(),
    type: transactionType,
    updatedAt: new Date(
      createdAt + chance.integer({ min: 0, max: 10000 }),
    ).toISOString(),
    value: chance.integer({ min: 0, max: 10000 }),
  };

  return transaction;
};

const messWithOlderTransaction = (eventsSent: any) => {
  const event: any = chance.pickone(eventsSent);
  const { transactionAt, status, updatedAt } = event;

  switch (status) {
    case 'PENDING':
      return {
        ...event,
        status: chance.weighted(['VALIDATED', 'CANCELED'], [80, 20]),
        executedAt: new Date(
          new Date(transactionAt).getTime()
            + chance.integer({ min: ONE_MINUTE_IN_MS, max: TWELVE_HOURS_IN_MS }),
        ),
      };

    case 'VALIDATED':
    case 'CANCELED': {
      const random = Math.random();
      if (random < 0.4) {
        return {
          ...event,
          status: 'PENDING',
          updatedAt: new Date(
            new Date(updatedAt).getTime()
            - chance.integer({
              min: ONE_MINUTE_IN_MS,
              max: 5 * ONE_MINUTE_IN_MS,
            }),
          ),
        };
      }
      return event;
    }

    default:
      return event;
  }
};

const bankAccounts = getBankAccounts();
const olderTransactions: any[] = [];

const generateTransaction = () => {
  let transaction;
  const random = Math.random();
  if (random < 0.3 && olderTransactions.length !== 0) {
    transaction = messWithOlderTransaction(olderTransactions);
  } else {
    transaction = generateRandomTransaction(bankAccounts);
    olderTransactions.push(transaction);
  }

  return transaction;
};

export default generateTransaction;
