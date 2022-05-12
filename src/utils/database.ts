import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import logger from '../utils/logger';

let db: Database | null = null;

const getDatabase = async () => {
  if (db) {
    return db;
  }
  db = await open({
    filename: 'test.db',
    driver: sqlite3.Database,
  });

  await userTable(db);
  await transactionTable(db);
  await completedTransactionTable(db);

  return db;
};

const userTable = async(db: Database) => {
  const createUserTableQuery = 'CREATE TABLE IF NOT EXISTS USER ( ID VARCHAR(100) , balance NUMBER, bankAccountID VARCHAR(100), currency VARCHAR(10) );';
  await db.run(createUserTableQuery, (err: any) => {
    if (err) {
      console.log('Error Occured creating USER table');
    } else {
      console.log(' USER Table Created');
    }
  });

}
const transactionTable = async(db:Database ) => {
  const createTransactionTableQuery = 'CREATE TABLE IF NOT EXISTS TRANSACTIONS ( eventID VARCHAR(100) , category VARCHAR(100), userID VARCHAR(100), bankAccountID VARCHAR(100), currency VARCHAR(10), description VARCHAR(100), transactionCreatedAt VARCHAR(50), executedAt VARCHAR(50),paymentMethod VARCHAR(50),status VARCHAR(50), title VARCHAR(50), transactionAt VARCHAR(50), transactionId VARCHAR(50), type VARCHAR(50), updatedAt VARCHAR(50),value NUMBER, raw VARCHAR(1000)  );';

  await db.run(createTransactionTableQuery, (err: any) => {
    if (err) {
      logger.info('Error Occured creating TRANSACTIIONS table ');
    } else {
      logger.info(' TRANSACTIONS Table Created');
    }
  });

}

const completedTransactionTable = async(db:Database ) => {
  const createCompletedTransactionTableQuery = 'CREATE TABLE IF NOT EXISTS COMPLETED_TRANSACTION ( eventID VARCHAR(100) , category VARCHAR(100), userID VARCHAR(100), bankAccountID VARCHAR(100), currency VARCHAR(10),paymentMethod VARCHAR(50),status VARCHAR(50), transactionId VARCHAR(50), type VARCHAR(50), value NUMBER  );';
  await db.run(createCompletedTransactionTableQuery, (err: any) => {
    if (err) {
      logger.info('Error Occured creating COMPLETED_TRANSACTION');
    } else {
      logger.info(' COmpleted COMPLETED_TRANSACTION Table Created');
    }
  });

}

export default getDatabase;
