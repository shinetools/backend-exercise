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

  await createUserTable(db);
  await createTransactionTable(db);
  await createErrorTable(db);

  return db;
};

// TODO build a class for Each Repository (SQL TABLE) which will have CRUD functions.

const createErrorTable = async(db: Database) => {
  const createUserTableQuery = 'CREATE TABLE IF NOT EXISTS ERROR ( eventID VARCHAR(100) , message VARCHAR(300), retry NUMBER );';
  await db.run(createUserTableQuery, (err: any) => {
    if (err) {
      console.log('Error Occured creating USER table');
    } else {
      console.log(' USER Table Created');
    }
  });
}

const createUserTable = async(db: Database) => {
  const createUserTableQuery = 'CREATE TABLE IF NOT EXISTS USER ( ID VARCHAR(100) , balance NUMBER, bankAccountID VARCHAR(100), currency VARCHAR(10), nextBalance NUMBER, PRIMARY KEY (bankAccountID));';
  await db.run(createUserTableQuery, (err: any) => {
    if (err) {
      console.log('Error Occured creating USER table');
    } else {
      console.log(' USER Table Created');
    }
  });

}
const createTransactionTable = async(db:Database ) => {
  const createTransactionTableQuery = 'CREATE TABLE IF NOT EXISTS TRANSACTIONS ( eventID VARCHAR(100) , category VARCHAR(100), userID VARCHAR(100), bankAccountID VARCHAR(100), currency VARCHAR(10), description VARCHAR(100), transactionCreatedAt VARCHAR(50), executedAt VARCHAR(50),paymentMethod VARCHAR(50),status VARCHAR(50), title VARCHAR(50), transactionAt VARCHAR(50), transactionId VARCHAR(50), type VARCHAR(50), updatedAt VARCHAR(50),value NUMBER, raw VARCHAR(1000), PRIMARY KEY (eventID)  );';

  await db.run(createTransactionTableQuery, (err: any) => {
    if (err) {
      logger.info('Error Occured creating TRANSACTIIONS table ');
    } else {
      logger.info(' TRANSACTIONS Table Created');
    }
  });

}


export default getDatabase;
