import { PaymentMethod, Transaction, TransactionStatus, TransactionType } from '../../types';

export const mockTransactionSql = {
  ":transactionId": "6fd1e7f4-bbde-5638-8c7f-aab9e0c04757",
  ":bankAccountId": "5d833d26-97d3-52b9-98ef-fc9085270d63",
  ":category": "TAX",
  ":userId": "1e8ce3e6-57b9-5aed-9598-ed7dba8ce824",
  ":createdAt": "1970-01-04T10:52:25.779Z",
  ":currency": "EUR", // will always be `EUR`
  ":description": "Transaction description",
  ":executedAt": "1970-01-17T00:00:33.146Z",
  ":paymentMethod": "DIRECT_DEBIT", // could be one of CARD, CHECK, DIRECT_DEBIT or TRANSFER
  ":status": "PENDING", // could be one of PENDING, CANCELED, VALIDATED
  ":title": "Transaction title",
  ":transactionAt": "1970-01-17T00:00:25.062Z",
  ":type": "PAYIN", // PAYIN for incoming transaction or PAYOUT for outgoing transaction
  ":updatedAt": "1970-01-04T10:52:27.281Z",
  ":value": 5000 // integer, e.g. 5000 equals to 50.00€
};

export const mockTransaction: Transaction = {
  "transactionId": "6fd1e7f4-bbde-5638-8c7f-aab9e0c04757",
  "bankAccountId": "5d833d26-97d3-52b9-98ef-fc9085270d63",
  "category": "TAX",
  "userId": "1e8ce3e6-57b9-5aed-9598-ed7dba8ce824",
  "createdAt": "1970-01-04T10:52:25.779Z",
  "currency": "EUR", // will always be `EUR`
  "description": "Transaction description",
  "executedAt": "1970-01-17T00:00:33.146Z",
  "paymentMethod": PaymentMethod.DirectDebit, // could be one of CARD, CHECK, DIRECT_DEBIT or TRANSFER
  "status": TransactionStatus.Pending, // could be one of PENDING, CANCELED, VALIDATED
  "title": "Transaction title",
  "transactionAt": "1970-01-17T00:00:25.062Z",
  "type": TransactionType.Payin, // PAYIN for incoming transaction or PAYOUT for outgoing transaction
  "updatedAt": "1970-01-04T10:52:27.281Z",
  "value": 5000 // integer, e.g. 5000 equals to 50.00€
};