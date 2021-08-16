import consume from '../../src/consumer';

describe('consumer', () => {
  it('should return true', async () => {
    const result = await consume({});

    expect(result).toEqual(true);
  });
});
