import logger from '../utils/logger';
import getDatabase from '../utils/database'
import { Database } from 'sqlite';
import { updateBalance } from '../balance/nextBalanceService';
export interface Event {
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
    //logger.info('Event received', { event });
    isValidTransaction(event)
    await getOrCreateTables(db)
    const {payload} = event
    await updateBalance(payload, db)

    return true;
  } catch (err) {
    console.log(err)
    return false;
  }
};


const getOrCreateTables = async (db: Database) => {
  try {
    await db.exec(`CREATE TABLE IF NOT EXISTS balances (
      bankAccountId TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      balance INTEGER NOT NULL,
      nextBalance INTEGER NOT NULL
      )`)
  } catch (err) {
    logger.error(`error creating tables: ${err}`)
    throw err
  }
}

const isValidTransaction = (event: Event) => {
  if (event.payload.type === 'BAD_TYPE' || event.payload.status === 'BAD_STATUS') {
    logger.warn('invalid transaction: ' + event.payload.transactionId)
    throw Error('invalid transaction')
  }
  return true
}

export default handle;
