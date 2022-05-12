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
    //logger.info('Event received', { event });

    const {payload} = event;
    const transactionAmount = payload?.value / 100;
    // TODO insert your code here
    // receive event,
    // transact from bank account,
    // update account/user Table and Transaction table
    //
  
    const rawEvent = JSON.stringify(event);
    db.serialize(() => {
      const insertTranactionsQuery = db.prepare('INSERT INTO TRANSACTIONS (eventID  , category , userID , bankAccountID , currency , description , transactionCreatedAt , executedAt ,paymentMethod ,status , title , transactionAt , transactionId , type , updatedAt ,value, raw) VALUES(?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
      
      insertTranactionsQuery.run([event.eventId, payload?.category, payload?.userId,  payload?.bankAccountId,  payload?.currency,  payload?.description,  payload?.createdAt, payload?.executedAt, payload?.paymentMethod, payload?.status,payload?.title,payload?.transactionAt,payload?.transactionId,payload?.type,payload?.updatedAt,transactionAmount, rawEvent ], (error: Error) => {
        if(error){
          logger.error(`transaction insert error. eventId: ${event.eventId}`)
        }
      });
      
      insertTranactionsQuery.finalize();
    });


    if( payload.status !== TransactionStatus.Pending) {
      db.serialize(() => {
        const insertCompletedTransactionQuery = db.prepare('INSERT INTO COMPLETED_TRANSACTION (eventID  , category , userID , bankAccountID , currency ,paymentMethod ,status , transactionId , type ,value) VALUES(?, ?,?,?,?,?,?,?,?,?)');
        insertCompletedTransactionQuery.run([event.eventId, payload?.category, payload?.userId,  payload?.bankAccountId,  payload?.currency, payload?.paymentMethod, payload?.status,payload?.transactionId,payload?.type,transactionAmount ], (error: Error) => {
          if(error){
            logger.error(` completed transaction insert error. eventId: ${event.eventId}`)
          }
        });

        insertCompletedTransactionQuery.finalize();
    
      });
    }
/*
    const res = db.get('SELECT * FROM TRANSACTIONS', (res:any, error: any, row:any) => {
      console.log('res: ',res);
      console.log('row: ',row);
    }); */
    
    return true;
  } catch (err) {
    console.log('handler err: ', err)
    return false;
  }
  
};

const creditOrDebit = (balance: number, transactionType: TransactionType, amount:number) => {
  return transactionType === TransactionType.PayIn? balance += amount :  balance -= amount;
}
export default handle;
