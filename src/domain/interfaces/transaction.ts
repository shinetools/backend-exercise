export enum TransactionCategory {
  DEFAULT = 'DEFAULT',
  BANKING = 'BANKING',
  CASH = 'CASH',
  CONTRIBUTIONS = 'CONTRIBUTIONS',
  EQUIPMENT = 'EQUIPMENT',
  FOOD = 'FOOD',
  HOTL = 'HOTEL',
  LEGAL = 'LEGAL',
  LOAN = 'LOAN',
  MAINTENANCE = 'MAINTENANCE',
  MISC = 'MISC',
  PERSONAL = 'PERSONAL',
  RENT = 'RENT',
  SERVICES = 'SERVICES',
  TAX = 'TAX',
  TELECOM = 'TELECOM',
  ALCOOL_TOBACCO = 'ALCOOL_TOBACCO',
  TRANSPORTATION = 'TRANSPORTATION',
  UTILITIES = 'UTILITIES',
  VEHICLE = 'VEHICLE',
  BETTING = 'BETTING',
}

export enum TransactionType {
  PAYIN = 'PAYIN',
  PAYOUT = 'PAYOUT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
  VALIDATED = 'VALIDATED',
}

export enum TransactionPaymentMethod {
  CARD = 'CARD',
  CHECK = 'CHECK',
  DIRECT_DEBIT = 'DIRECT_DEBIT',
  TRANSFER = 'TRANSFER',
}

export enum TransactionCurrency {
  EUR = 'EUR',
}
