import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

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
  const createUserTableQuery = 'CREATE TABLE USER ( ID VARCHAR(100) , balance NUMBER, bankAccountID VARCHAR(100), currency VARCHAR(10) );';
  await db.run('SELECT ID from USER WHERE ID = 1', async (err: any) => {
    if (err) {
      console.log('Some Error Occured, ', err);
      await db.run(createUserTableQuery, (err: any) => {
        if (err) {
          console.log('Some Error Occured');
        } else {
          console.log(' User Table Created');
        }
      });
    } else {
      console.log('table exists')
      return;
    }
  })
  


}
const transactionTable = async(db:Database ) => {
  const createTransactionTableQuery = 'CREATE TABLE TRANSACTIONS ( eventID VARCHAR(100) , category VARCHAR(100), userID VARCHAR(100), bankAccountID VARCHAR(100), currency VARCHAR(10), description VARCHAR(100), transactionCreatedAt VARCHAR(50), executedAt VARCHAR(50),paymentMethod VARCHAR(50),status VARCHAR(50), title VARCHAR(50), transactionAt VARCHAR(50), transactionId VARCHAR(50), type VARCHAR(50), updatedAt VARCHAR(50),value NUMBER, raw VARCHAR(1000)  );';

  await db.run('SELECT eventID from TRANSACTIONS WHERE eventID = 1', async (err: any) => {
    if (err) {
      console.log('Some Error Occured, ', err);
      await db.run(createTransactionTableQuery, (err: any) => {
        if (err) {
          console.log('Some Error Occured');
        } else {
          console.log(' TRANSACTIONS Table Created');
        }
      });
    } else {
      console.log('table exists')
      return;
    }
  })

}

const completedTransactionTable = async(db:Database ) => {
  const createCompletedTransactionTableQuery = 'CREATE TABLE COMPLETED_TRANSACTION ( eventID VARCHAR(100) , category VARCHAR(100), userID VARCHAR(100), bankAccountID VARCHAR(100), currency VARCHAR(10),paymentMethod VARCHAR(50),status VARCHAR(50), transactionId VARCHAR(50), type VARCHAR(50), value NUMBER  );';
  await db.run('SELECT eventID from COMPLETED_TRANSACTION WHERE eventID = 1', async (err: any) => {
    if (err) {
      console.log('Some Error Occured, ', err);
      await db.run(createCompletedTransactionTableQuery, (err: any) => {
        if (err) {
          console.log('Some Error Occured');
        } else {
          console.log(' COmpleted COMPLETED_TRANSACTION Table Created');
        }
      });
    } else {
      console.log('table exists')
      return;
    }
  })


}

export default getDatabase;
