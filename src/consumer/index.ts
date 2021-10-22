import logger from '../utils/logger';
import getDatabase from '../utils/database'

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
    logger.info('Event received', { event });
    const {bankAccountId,userId,type} = event.payload

    // TODO insert your code here
    console.log(creditSum(event))
    await db.exec(`CREATE TABLE IF NOT EXISTS balances (
      bankAccountId TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      balance INTEGER NOT NULL)`)
    console.log({bankAccount: bankAccountId})
    const currentBalance = await db.get('SELECT balance FROM balances WHERE bankAccountId = ?', bankAccountId)
    console.log(currentBalance)
    let result
    if (currentBalance) {
    result = await db.run(
      'INSERT INTO balances (bankAccountId, userId, balance) VALUES (?,?,?)',bankAccountId,userId,event.payload.value
    )
  } else {
    console.log(currentBalance)
  }
  console.log(result)


    return true;
  } catch (err) {
    return false;
  }
};

const creditSum = (event: Event) => {
  if (event.payload.type === 'PAYOUT') return event.payload.value * -1
  return event.payload.value
}

export default handle;
