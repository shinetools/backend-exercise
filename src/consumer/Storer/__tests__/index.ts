import { v4 } from 'uuid';
import Storer from '..';
import { PaymentMethod, Transaction, TransactionStatus, TransactionType } from '../../types';

describe('Storer', () => {
  it('should be a class with an id and an initialize method and a private database init to "null"', async () => {
    const testStorer = new Storer();
    expect(typeof testStorer.id).toBe('string');
    expect(typeof testStorer.initialize).toBe('function');
    expect(testStorer.isInitialized).toBe(false);
  });

  it('should be able to initialize the db', async () => {
    const testStorer = new Storer();
    expect(testStorer.isInitialized).toBe(false);
    await testStorer.initialize();
    expect(testStorer.isInitialized).toBe(true);
  });

  it('should be able to store a transaction into the db', async () => {
    const testStorer = new Storer();
    await testStorer.initialize();
    const testTransaction: Transaction = {
      bankAccountId: "5d833d26-97d3-52b9-98ef-fc9085270d63",
      category: "TAX",
      userId: "1e8ce3e6-57b9-5aed-9598-ed7dba8ce824",
      createdAt: "1970-01-04T10:52:25.779Z",
      currency: "EUR", // will always be `EUR`
      description: "Transaction description",
      executedAt: "1970-01-17T00:00:33.146Z",
      paymentMethod: PaymentMethod.DirectDebit, // could be one of CARD, CHECK, DIRECT_DEBIT or TRANSFER
      status: TransactionStatus.Pending, // could be one of PENDING, CANCELED, VALIDATED
      title: "Transaction title",
      transactionAt: "1970-01-17T00:00:25.062Z",
      transactionId: v4(),
      type: TransactionType.Payin, // PAYIN for incoming transaction or PAYOUT for outgoing transaction
      updatedAt: "1970-01-04T10:52:27.281Z",
      value: 5000 // integer, e.g. 5000 equals to 50.00€
    };
    testStorer.storeTransaction(testTransaction);
    // expect(testStorer.getTransaction(id)).toBe(true);
  });
});


// 1. Store the received transaction using the SQLite database provided in utils/database.ts
// 1A. Store a transaction using SQLite
// 1B. Get a transaction previously stored
