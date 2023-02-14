import { v4 } from 'uuid';
import Storer from '..';
import getDatabase from '../../../utils/database';
import { mockTransaction, mockTransactionSql } from './mocks';
import { transactionInsertQuery, transactionDeleteQuery } from '../utils';
import { ValidationResult } from '../../types';

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

  it('should retrieve a transaction', async () => {
    const testStorer = new Storer();
    expect(testStorer.isInitialized).toBe(false);
    await testStorer.initialize();
    expect(testStorer.isInitialized).toBe(true);
  });

  describe('Storer - queries', () => {
    beforeAll(async () => {
      const db = await getDatabase();
      await db.run(transactionInsertQuery, mockTransactionSql);
    });
  
    it('should retrieve a transaction', async () => {
        const testStorer = new Storer();
        await testStorer.initialize();
        const result = await testStorer.getTransactionById(mockTransactionSql[':transactionId']);
        expect(result.transactionId).toBe(mockTransactionSql[':transactionId']);
    });
  
    it('should store a transaction', async () => {
        const testStorer = new Storer();
        await testStorer.initialize();
        const testId = v4();
        const testValue = 1234;
        const testTransaction = Object.assign({}, mockTransaction, { transactionId: testId, value: testValue });
        const insertResult = await testStorer.storeTransaction(testTransaction);
        expect(insertResult).toMatchObject({ changes: 1 });
        const result = await testStorer.getTransactionById(testId);
        expect(result.transactionId).toBe(testId);
    });
    afterAll(async () => {
      const db = await getDatabase();
      await db.run(transactionDeleteQuery, mockTransactionSql[':transactionId']);
    });
  });

  describe('Storer - validations', () => {
    it('should validate a valid transaction', async () => {
        const testStorer = new Storer();
        await testStorer.initialize();
        const testId = v4();
        const invalidValue = 1234;
        const testTransaction = Object.assign({}, mockTransaction, { transactionId: testId, value: invalidValue });
        const validationResult = testStorer.validateTransaction(testTransaction);
        expect(validationResult.ok).toBe(true);
    });
  
    it('should refuse an invalid transaction', async () => {
      const testStorer = new Storer();
      await testStorer.initialize();
      const testId = v4();
      const invalidValue = 'ciao';
      const testTransaction = Object.assign({}, mockTransaction, { transactionId: testId, value: invalidValue });
      const validationResult: ValidationResult = testStorer.validateTransaction(testTransaction);
      expect(validationResult.ok).toBe(false);
      expect(validationResult.message).toBe('transaction.value must be of type number but was string');
    });

    afterAll(async () => {
      const db = await getDatabase();
      await db.run(transactionDeleteQuery, mockTransactionSql[':transactionId']);
    });
  });
});

// cet aprem
// 1. finire store: check
// 2. validare dati: check
// 3. brancher agli eventi
// 4. in caso di indisponibilita
