import joi from 'joi';

export const EventSchema = {
  eventId: joi.string().required(),
  retry: joi.number().required(),
  payload: joi
    .object({
      bankAccountId: joi.string().required(),
      userId: joi.string().required(),
      category: joi
        .string()
        .valid(
          'DEFAULT',
          'BANKING',
          'CASH',
          'CONTRIBUTIONS',
          'EQUIPMENT',
          'FOOD',
          'HOTEL',
          'LEGAL',
          'LOAN',
          'MAINTENANCE',
          'MISC',
          'PERSONAL',
          'RENT',
          'SERVICES',
          'TAX',
          'TELECOM',
          'ALCOOL_TOBACCO',
          'TRANSPORTATION',
          'UTILITIES',
          'VEHICLE',
          'BETTING',
        )
        .required(),
      createdAt: joi.string().required(),
      currency: joi.string().valid('EUR').required(),
      description: joi.string().required(),
      executedAt: joi.string().required(),
      paymentMethod: joi
        .string()
        .valid('CARD', 'CHECK', 'DIRECT_DEBIT', 'TRANSFER')
        .required(),
      status: joi.string().valid('PENDING', 'CANCELED', 'VALIDATED').required(),
      title: joi.string().required(),
      transactionAt: joi.string().required(),
      transactionId: joi.string().required(),
      type: joi.string().valid('PAYIN', 'PAYOUT').required(),
      updatedAt: joi.string().required(),
      value: joi.number().required(),
    })
    .required(),
};
