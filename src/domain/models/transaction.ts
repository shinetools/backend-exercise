import {
  TransactionCategory,
  TransactionType,
  TransactionStatus,
  TransactionPaymentMethod,
  TransactionCurrency,
} from '../interfaces/transaction';

export class Transaction {
  bankAccountId: string;

  userId: string;

  transactionId: string;

  category: TransactionCategory;

  title: string;

  description: string;

  type: TransactionType;

  status: TransactionStatus;

  paymentMethod: TransactionPaymentMethod;

  currency: TransactionCurrency;

  value: number;

  createdAt: Date;

  executedAt: Date;

  transactionAt: Date;

  updatedAt: Date;

  constructor(
    bankAccountId: string,
    userId: string,
    transactionId: string,
    category: TransactionCategory,
    title: string,
    description: string,
    type: TransactionType,
    status: TransactionStatus,
    paymentMethod: TransactionPaymentMethod,
    currency: TransactionCurrency,
    value: number,
    createdAt: Date,
    executedAt: Date,
    transactionAt: Date,
    updatedAt: Date,
  ) {
    this.bankAccountId = bankAccountId;
    this.userId = userId;
    this.transactionId = transactionId;
    this.category = category;
    this.title = title;
    this.description = description;
    this.type = type;
    this.status = status;
    this.paymentMethod = paymentMethod;
    this.currency = currency;
    this.value = value;
    this.createdAt = createdAt;
    this.executedAt = executedAt;
    this.transactionAt = transactionAt;
    this.updatedAt = updatedAt;
  }
}
