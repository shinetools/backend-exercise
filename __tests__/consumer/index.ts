import consume from '../../src/consumer';

describe('consumer', () => {
  it('should return false if bad type', async () => {
    // Given
    const event = {
      "eventId": "59f31035-cc07-42ac-9039-f1c14b8b0675",
      "payload": {
          "bankAccountId": "1428c40b-3ab7-5c86-b85a-5f9d44b9b202",
          "category": "TELECOM",
          "userId": "0499110a-4d79-53c7-848b-51c1b3df2f4b",
          "createdAt": "1970-01-11T08:00:33.550Z",
          "currency": "EUR",
          "description": "Nozrure wip rupuzik owezehje omtot deuco ne mafekic ipu ufiidpo.",
          "executedAt": "1970-01-18T14:46:15.353Z",
          "paymentMethod": "TRANSFER",
          "status": "PENDING",
          "title": "Puuj citi vika.",
          "transactionAt": "1970-01-18T14:46:06.688Z",
          "transactionId": "7ae02481-cecb-595b-b820-b6efb5621ac0",
          "type": "BAD_TYPE",
          "updatedAt": "1970-01-11T08:00:43.031Z",
          "value": 1910
      },
      "retry": 0
  }
    const result = await consume(event);

    expect(result).toEqual(false);
  });
  it('should return false if bad status', async () => {``
    // Given
    const event = {
      "eventId": "59f31035-cc07-42ac-9039-f1c14b8b0675",
      "payload": {
          "bankAccountId": "1428c40b-3ab7-5c86-b85a-5f9d44b9b202",
          "category": "TELECOM",
          "userId": "0499110a-4d79-53c7-848b-51c1b3df2f4b",
          "createdAt": "1970-01-11T08:00:33.550Z",
          "currency": "EUR",
          "description": "Nozrure wip rupuzik owezehje omtot deuco ne mafekic ipu ufiidpo.",
          "executedAt": "1970-01-18T14:46:15.353Z",
          "paymentMethod": "TRANSFER",
          "status": "BAD_STATUS",
          "title": "Puuj citi vika.",
          "transactionAt": "1970-01-18T14:46:06.688Z",
          "transactionId": "7ae02481-cecb-595b-b820-b6efb5621ac0",
          "type": "PAYIN",
          "value": 1910
      },
      "retry": 0
  }
    const result = await consume(event);

    expect(result).toEqual(false);
  });
  it('should create Balance and return true', async () => {``
    // Given
    const event = {
      "eventId": "59f31035-cc07-42ac-9039-f1c14b8b0675",
      "payload": {
          "bankAccountId": "1428c40b-3ab7-5c86-b85a-5f9d44b9b202",
          "category": "TELECOM",
          "userId": "0499110a-4d79-53c7-848b-51c1b3df2f4b",
          "createdAt": "1970-01-11T08:00:33.550Z",
          "currency": "EUR",
          "description": "Nozrure wip rupuzik owezehje omtot deuco ne mafekic ipu ufiidpo.",
          "executedAt": "1970-01-18T14:46:15.353Z",
          "paymentMethod": "TRANSFER",
          "status": "VALIDATED",
          "title": "Puuj citi vika.",
          "transactionAt": "1970-01-18T14:46:06.688Z",
          "transactionId": "7ae02481-cecb-595b-b820-b6efb5621ac0",
          "type": "PAYIN",
          "value": 1910
      },
      "retry": 0
  }
    const result = await consume(event);

    expect(result).toEqual(true);
  });
});
