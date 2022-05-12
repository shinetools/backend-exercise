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

enum currency{
  Eur= 'EUR'
}

enum TransactionpaymentMethod {
  DirectDebit = 'DIRECT_DEBIT',
  Card = 'CARD',
  Check = 'CHECK',
  Transfer ='TRANSFER'
}
interface TransactionPayload {
  bankAccountId: string,
  category: string,
  userId: string,
  createdAt: string,
  currency: currency.Eur,
  description: string,
  executedAt: string,
  paymentMethod: TransactionpaymentMethod,
  status: TransactionStatus,
  title: string,
  transactionAt: string,
  transactionId: string,
  type:TransactionType,
  updatedAt: string,
  value: number
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
  const db = await database();
  try {
    //logger.info('Event received', { event });

    const {payload} = event;
    try{
      await saveTransaction(payload, event);
      await computeBalance(payload);
    } catch(err) {
      logger.error(`err save Transaction: ${JSON.stringify(err)}`);

      await db.run('INSERT INTO ERROR (eventID, message, retry) VALUES(?,?,?)', [event.eventId, JSON.stringify(err), event.retry])
    }
    
    return true;
  } catch (err) {
    console.log('handler err: ', err)
    return false;
  }
  
};

const computeBalance = async(payload:TransactionPayload) => {
  const db = await database();
  if( payload.status === TransactionStatus.Validated) {
    // query userID balance
    const getBankIDQuery =  await db.get('SELECT ID,balance, bankAccountID FROM USER WHERE bankAccountID = ?', [payload.bankAccountId]);
    //Bank account dont exists.
    if(!getBankIDQuery){
      const balance = creditOrDebit(0, payload.type, payload.value)
     await db.run('INSERT INTO USER (ID  , balance , bankAccountID , currency ) VALUES(?, ?,?,?)', 
      [payload?.userId, balance, payload.bankAccountId, payload.currency]);

    } else { // retrieved Bank balance donc update balance
      const balance = creditOrDebit(getBankIDQuery?.balance as number, payload.type, payload.value )
      await db.run('UPDATE USER SET balance = ? WHERE bankAccountID =?', 
      [balance, payload.bankAccountId]);
    }
  } else if (payload.status === TransactionStatus.Pending) {
    // query userID balance
    const getBankIDQuery =  await db.get('SELECT ID,balance, bankAccountID FROM USER WHERE bankAccountID = ?', [payload.bankAccountId]);
    //Bank account dont exists.
    if(!getBankIDQuery){
      const nextBalance = creditOrDebit(0, payload.type, payload.value)
     await db.run('INSERT INTO USER (ID  , balance , bankAccountID , currency, nextBalance  ) VALUES(?, ?,?,?,?)', 
      [payload?.userId, 0, payload.bankAccountId, payload.currency, nextBalance]);

    } else { // retrieved Bank balance donc update balance
      const nextBalance = creditOrDebit(getBankIDQuery?.balance as number, payload.type, payload.value )
      await db.run('UPDATE USER SET nextBalance = ? WHERE bankAccountID =?', 
      [nextBalance, payload.bankAccountId]);
    }
  } else if (payload.status === TransactionStatus.Canceled) {
    // query userID balance
    const getBankIDQuery =  await db.get('SELECT ID,balance, bankAccountID FROM USER WHERE bankAccountID = ?', [payload.bankAccountId]);
    // next balance goes to zero because possible transaction was cancelled
    if(getBankIDQuery){
      await db.run('UPDATE USER SET nextBalance = ? WHERE bankAccountID =?', 
      [0, payload.bankAccountId]);
    } 
  }
}

const saveTransaction = async ( payload: TransactionPayload, event: Event) =>{
  const db = await database();
  const transactionAmount = payload?.value / 100;  
  const rawEvent = JSON.stringify(event);
  const insertTranactionsQuery = await db.run('INSERT INTO TRANSACTIONS (eventID  , category , userID , bankAccountID , currency , description , transactionCreatedAt , executedAt ,paymentMethod ,status , title , transactionAt , transactionId , type , updatedAt ,value, raw) VALUES(?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
  [event.eventId, payload?.category, payload?.userId,  payload?.bankAccountId,  payload?.currency,  payload?.description,  payload?.createdAt, payload?.executedAt, payload?.paymentMethod, payload?.status,payload?.title,payload?.transactionAt,payload?.transactionId,payload?.type,payload?.updatedAt,transactionAmount, rawEvent ]);
    
  if(!insertTranactionsQuery) {
    logger.error(`Error inserting Transaction Query. eventId: ${event.eventId}`)
  }
  if( payload.status === TransactionStatus.Validated || payload.status === TransactionStatus.Canceled) {
    const insertCompletedTransactionQuery =  await db.run('INSERT INTO COMPLETED_TRANSACTION (eventID  , category , userID , bankAccountID , currency ,paymentMethod ,status , transactionId , type ,value) VALUES(?, ?,?,?,?,?,?,?,?,?)', 
    [event.eventId, payload?.category, payload?.userId,  payload?.bankAccountId,  payload?.currency, payload?.paymentMethod, payload?.status,payload?.transactionId,payload?.type,transactionAmount ]);
    
    if(!insertCompletedTransactionQuery) {
      logger.error(`Error inserting CompletedTransaction Query. eventId: ${event.eventId}`)
    }
  }

}

const creditOrDebit = (balance: number, transactionType: TransactionType, amount:number) => {
  return transactionType === TransactionType.PayIn? balance += amount :  balance -= amount;
}
export default handle;
