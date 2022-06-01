// DO NOT EDIT THIS FILE
import queue from 'queue';
import { v4 as uuid } from 'uuid';
import logger from './utils/logger';
import produce from './producer';
import consume from './consumer';

const MAX_QUEUE_LENGTH = 30;
const INTERVAL_MS = 2000;

interface JobParams {
  payload: any;
  id?: string;
  q: queue;
  retry?: number;
}

const createJob = ({
  payload, id, q, retry = 0,
}: JobParams) => () => new Promise<void>(async (resolve) => {
  const eventId = id || uuid();
  const ack = await consume({ eventId, payload, retry });
  if (!ack) {
    logger.debug('Adding back event to the queue for retry', {
      payload,
      retry,
    });
    q.push(createJob({
      id: eventId, payload, q, retry: retry + 1,
    }));
  }
  resolve();
});

const main = async () => {
  logger.info('Initializing');
  const q = queue({ autostart: true, concurrency: 1 });
  q.start();

  logger.info('Queue initialized');

  setInterval(() => {
    if (q.length < MAX_QUEUE_LENGTH) {
      q.push(createJob({ q, payload: produce() }));
    }
  }, INTERVAL_MS);
};

if (require.main === module) {
  main();
}
