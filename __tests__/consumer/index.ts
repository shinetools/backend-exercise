import consume from '../../src/infrastructure/consumer';
import * as useCases from '../../src/application/use-cases/store-transaction-use-case';

const event = {
  eventId: 'eventId1',
  retry: 0,
  payload: {
    bankAccountId: '5d833d26-97d3-52b9-98ef-fc9085270d63',
    category: 'TAX',
    userId: '1e8ce3e6-57b9-5aed-9598-ed7dba8ce824',
    createdAt: '1970-01-04T10:52:25.779Z',
    currency: 'EUR',
    description: 'Transaction description',
    executedAt: '1970-01-17T00:00:33.146Z',
    paymentMethod: 'DIRECT_DEBIT',
    status: 'PENDING',
    title: 'Transaction title',
    transactionAt: '1970-01-17T00:00:25.062Z',
    transactionId: '6fd1e7f4-bbde-5638-8c7f-aab9e0c04757',
    type: 'PAYIN',
    updatedAt: '1970-01-04T10:52:27.281Z',
    value: 5000,
  },
};

let spy: jest.SpyInstance;

describe('consumer', () => {
  beforeEach(() => {
    spy = jest.spyOn(useCases, 'storeTransactionUseCase').mockResolvedValue();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true', async () => {
    const result = await consume(event);

    console.log(spy.mock.calls);

    expect(result).toEqual(true);
  });

  // it('should properly store the transaction in a SQLite when there is no error', async () => {
  //   const res = await storeTransactionUseCase({});

  //   expect(result).toEqual(true);
  // });
});
