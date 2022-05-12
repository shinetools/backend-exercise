import logger from '../utils/logger';
import database from '../utils/database'
interface Event {
  eventId: string;
  payload: any;
  retry: number;
}

enum TransactionStatus {
  Pending = 'PENDING',
  Canceled = 'CANCELED',
  Validated ='VALIDATED'
}

enum TransactionType {
  PayIn = 'PAYIN',
  Payout = 'PAYOUT'
}
/**
 * A handler that will receive transaction events
 *
 * @param {object} event - The received event from the queue
 * @param {object} event.eventId - The unique id of the event
 * @param {string} event.payload - The payload of the event
 * @param {number} event.retry - The number of retries (defaults to 0)
 * @returns {boolean} false if the event needs to be retried, else true
 */
const handle = async (event: Event) => {
  const db = (await database()).db;
  try {
    logger.info('Event received', { event });

    const {payload, retry} = event;
    const transactionAmount = payload.value / 100;
    // TODO insert your code here
        // receive event,
    // transact from bank account,
    // update account/user Table and Transaction table
    //
  
    const rawEvent = JSON.stringify(event);
    db.serialize(() => {
      const insertTranactionsQuery = db.prepare('INSERT INTO TRANSACTIONS (eventID  , category , userID , bankAccountID , currency , description , transactionCreatedAt , executedAt ,paymentMethod ,status , title , transactionAt , transactionId , type , updatedAt ,value, raw) VALUES(?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
      
      insertTranactionsQuery.run([event.eventId, payload?.category, payload?.userId,  payload?.bankAccountId,  payload?.currency,  payload?.description,  payload?.createdAt, payload?.executedAt, payload?.paymentMethod, payload?.status,payload?.title,payload?.transactionAt,payload?.transactionId,payload?.type,payload?.updatedAt,transactionAmount, rawEvent ]);
      insertTranactionsQuery.finalize();
    });

    if( payload.status !== TransactionStatus.Pending) {
      db.serialize(() => {
        const insertCompletedTransactionQuery = db.prepare('INSERT INTO COMPLETED_TRANSACTION (eventID  , category , userID , bankAccountID , currency ,paymentMethod ,status , transactionId , type ,value) VALUES(?, ?,?,?,?,?,?,?,?,?)');
        insertCompletedTransactionQuery.run([event.eventId, payload?.category, payload?.userId,  payload?.bankAccountId,  payload?.currency, payload?.paymentMethod, payload?.status,payload?.transactionId,payload?.type,transactionAmount ]);
        insertCompletedTransactionQuery.finalize();
    
      });

      db.serialize(() => {
        const insertUserQuery = db.prepare('INSERT INTO USER (ID  , balance , bankAccountID , currency ) VALUES(?, ?,?,?)');
        const updateUserBalanceQuery = db.prepare('UPDATE USER SET balance = ? WHERE ID = ?')
        const getUserBalanceQuery = db.prepare('SELECT ID,balance FROM USER WHERE ID = ?');
        // get existning balance using ID 
        // based on transaction do the right math.

        //payload?.value
        let balance = 0;
        const balanceQueryResult = getUserBalanceQuery.run([payload.userId])
        console.log('balance: ', balanceQueryResult)

        if(!balanceQueryResult){
          balance = creditOrDebit(balance, payload.type, transactionAmount)
          insertUserQuery.run([payload?.userId,balance, payload?.bankAccountId, payload?.currency ]);
          insertUserQuery.finalize();
        } else {
          //TODO: get balance from - getUserBalanceQuery
          balance = creditOrDebit(balance, payload.type, transactionAmount);

          updateUserBalanceQuery.run([balance,payload?.userId]);
          updateUserBalanceQuery.finalize();
        }
        
    
      });
    }

  
    db.close();

    //logger.info('temp: ', temp)



    return true;
  } catch (err) {
    return false;
  }
};

const creditOrDebit = (balance: number, transactionType: TransactionType, amount:number) => {
  return transactionType === TransactionType.PayIn? balance += amount :  balance-= amount;
}
export default handle;
