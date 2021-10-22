import logger from '../utils/logger';
import getDatabase from '../utils/database'
import { Database } from 'sqlite';
interface Event {
  eventId: string;
  payload: any;
  retry: number;
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
  const db = await getDatabase()

  try {
    isValidTransaction(event)
    await getOrCreateTables(db)
    logger.info('Event received', { event });
    const {payload} = event
    const {bankAccountId,userId,type,status,value, transactionId} = payload
    
    
    const table = getConcernedTable(status)
    
    const currentBalance = await db.get(`SELECT balance FROM ${table} WHERE bankAccountId = ?`, bankAccountId)
    let result
    if (!currentBalance) {
      logger.info(`First ${table} for account ` +  bankAccountId);
      result = await db.run(
        `INSERT INTO ${table} (bankAccountId, transactionId, userId, balance) VALUES (?,?,?,?)`,bankAccountId,transactionId,userId,value
      )
  } else {
    logger.info(`Updating ${table} for account ` +  bankAccountId);
    const newBalance = balanceToSet(currentBalance.balance, value, type)
      result = await db.run(`UPDATE ${table} SET balance = ? WHERE bankAccountId = ?`,newBalance, bankAccountId)
  }
    return true;
  } catch (err) {
    return false;
  }
};

const getConcernedTable = (status: String) => {
  if (status === 'VALIDATED') return 'balances'
  return 'nextBalances'
}

const balanceToSet = (currentBalance: number, sumToCredit: number, type: string) => (currentBalance + creditSum(type, sumToCredit))

const creditSum = (type: string, sum: number):number => {
  if (type === 'PAYOUT') return -1 * sum
  return 1 * sum
}

const getOrCreateTables = async (db: Database) => {
  try {
    await db.exec(`CREATE TABLE IF NOT EXISTS balances (
      bankAccountId TEXT PRIMARY KEY,
      transactionId TEXT NOT NULL,
      userId TEXT NOT NULL,
      balance INTEGER NOT NULL)`)
    await db.exec(`CREATE TABLE IF NOT EXISTS nextBalances (
      bankAccountId TEXT PRIMARY KEY,
      transactionId TEXT NOT NULL,
      userId TEXT NOT NULL,
      balance INTEGER NOT NULL)`)
      // logger.info(`Database And Tables Ready`)
  } catch (err) {
    logger.error(`error creating tables: ${err}`)
    throw err
  }
}

const isValidTransaction = (event: Event) => {
  logger.info(event.payload.type)
  logger.info(event.payload.status)
  if (event.payload.type === 'BAD_TYPE' || event.payload.status === 'BAD_STATUS') {
    logger.warn('invalid transaction')
    throw Error('invalid transaction')
  }
  return true
}

export default handle;
