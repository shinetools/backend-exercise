import logger from '../utils/logger';
import Storer from './Storer';

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
  try {
    logger.info('Event received', { event });
    
    const testStorer = new Storer();
    await testStorer.initialize();
    const { payload: eventTransaction } = event;
    await testStorer.storeTransaction(eventTransaction);

    return true;
  } catch (err: any) {
    // Error handling 1
    // 1. Functional errors: errors are throwed by the Storer component if
    // 1A. the component has not initialized correctly
    // 1B. the component has validation errors, discovered by the validation function (validation component to be)
    // 1C. the insert query has failed, an SQLITE error is thrown in that case
    logger.error(`[Consumer] event exception with error ${err.message}`, err, event);
    // on top of logging, it would be nice to send error events to the message bus
    // other consumers could be developed to treat them (retry mechanism, DLQ, etc)
    return false;
  }
};

export default handle;
