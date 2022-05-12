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
 * @param {string} event.eventId - The unique id of the event
 * @param {TransactionPayload} event.payload - The payload of the event
 * @param {number} event.retry - The number of retries (defaults to 0)
 * @returns {boolean} false if the event needs to be retried, else true
 */
const handle = async (event: Event): Promise<boolean> => {
  const db = await database();
  //logger.info('Event received', { event });
  try {
    const {payload} = event;
    try{
      await saveTransactionEvent(payload, event);
      await computeBalancePerBankAccount(payload);
    } catch(err) {
      logger.error(`err save Transaction: ${JSON.stringify(err)}`);
      await db.run('INSERT INTO ERROR (eventID, message) VALUES(?,?)', [event.eventId, JSON.stringify(err)])
    }
    
    return true;
  } catch (err) {
    logger.error(`handler err: ${err}`)
    if(event.retry > 4) return true;
    return false;
  }
  
};

/**
 * computeBalancePerBankAccount takes Event payload as param 
 * This computes whether we debit or credit user account couloumn and also update
 *   nextBalance
 *
 * @param {TransactionPayload} payload - The payload in the Event object.
 * @returns {void} - returns void
 */
const computeBalancePerBankAccount = async(payload:TransactionPayload): Promise<void> => {
  const db = await database();
  if( payload.status === TransactionStatus.Validated) {
    // query userID balance
    const getBankInfoByIDQuery =  await db.get('SELECT ID,balance, bankAccountID FROM USER WHERE bankAccountID = ?', [payload.bankAccountId]);
    //Bank account dont exists.
    if(!getBankInfoByIDQuery){
      const balance = creditOrDebitBalance(0, payload.type, payload.value)
     await db.run('INSERT INTO USER (ID  , balance , bankAccountID , currency ) VALUES(?, ?,?,?)', 
      [payload?.userId, balance, payload.bankAccountId, payload.currency]);

    } else { // retrieved Bank balance donc update balance
      const balance = creditOrDebitBalance(getBankInfoByIDQuery?.balance as number, payload.type, payload.value )
      await db.run('UPDATE USER SET balance = ?, nextBalance=? WHERE bankAccountID =?', 
      [balance, balance, payload.bankAccountId]);
    }
  } else if (payload.status === TransactionStatus.Pending) {
    // query userID balance
    const getBankInfoByIDQuery =  await db.get('SELECT ID,balance, bankAccountID FROM USER WHERE bankAccountID = ?', [payload.bankAccountId]);
    //Bank account dont exists.
    if(!getBankInfoByIDQuery){
      const nextBalance = creditOrDebitBalance(0, payload.type, payload.value)
     await db.run('INSERT INTO USER (ID  , balance , bankAccountID , currency, nextBalance  ) VALUES(?, ?,?,?,?)', 
      [payload?.userId, 0, payload.bankAccountId, payload.currency, nextBalance]);

    } else { // retrieved Bank balance donc update balance
      const nextBalance = creditOrDebitBalance(getBankInfoByIDQuery?.balance as number, payload.type, payload.value )
      await db.run('UPDATE USER SET nextBalance = ? WHERE bankAccountID =?', 
      [nextBalance, payload.bankAccountId]);
    }
  } else if (payload.status === TransactionStatus.Canceled) {
    // query userID balance
    const getBankInfoByIDQuery =  await db.get('SELECT ID,balance,nextBalance bankAccountID FROM USER WHERE bankAccountID = ?', [payload.bankAccountId]);

    const nextBalance = creditOrDebitBalance(getBankInfoByIDQuery?.nextBalance as number, payload.type, payload.value , true)
    // next balance goes to zero because possible transaction was cancelled
    if(getBankInfoByIDQuery){
      await db.run('UPDATE USER SET nextBalance = ? WHERE bankAccountID =?', 
      [nextBalance, payload.bankAccountId]);
    } 
  }
}

/**
 * saveTransactionEvent takes Event and payload as param. saves all transactions to DB
 * This computes whether we debit or credit user account couloumn and also update
 *   nextBalance
 * @param {Event} event - The the Event object recieved by handler.
 * @param {TransactionPayload} payload - The payload in the Event object.
 * @returns {void} - returns void
 */
const saveTransactionEvent = async ( payload: TransactionPayload, event: Event): Promise<void> =>{
  const db = await database();
  const transactionAmount = payload?.value / 100;  
  const rawEvent = JSON.stringify(event);
  const insertTranactionsQuery = await db.run('INSERT INTO TRANSACTIONS (eventID  , category , userID , bankAccountID , currency , description , transactionCreatedAt , executedAt ,paymentMethod ,status , title , transactionAt , transactionId , type , updatedAt ,value, raw) VALUES(?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
  [event.eventId, payload?.category, payload?.userId,  payload?.bankAccountId,  payload?.currency,  payload?.description,  payload?.createdAt, payload?.executedAt, payload?.paymentMethod, payload?.status,payload?.title,payload?.transactionAt,payload?.transactionId,payload?.type,payload?.updatedAt,transactionAmount, rawEvent ]);
    
  if(!insertTranactionsQuery) {
    logger.error(`Error inserting Transaction Query. eventId: ${event.eventId}`)
  }
}

/**
 * creditOrDebit takes Event and payload as param 
 * This computes whether we debit or credit user account couloumn and also update
 *   nextBalance
 * @param {number} balance - current user balance.
 * @param {TransactionType} transactionType - type of transaction to be computed.
 * @param {number} transactionAmount - The amount to be transacted on the account.
 * @param {boolean} reverseTransaction - The amount to be transacted on the account.
 * @returns {number} - returns latest balance after creditting or debitting
 */
const creditOrDebitBalance = (balance: number, transactionType: TransactionType, transactionAmount:number, reverseTransaction: boolean = false): number => {
  if(reverseTransaction){
    return transactionType === TransactionType.PayIn? balance -= transactionAmount :  balance += transactionAmount;
  }
  return transactionType === TransactionType.PayIn? balance += transactionAmount :  balance -= transactionAmount;
}
export default handle;
