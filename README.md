# backend-exercise

_This repository provides a basic configuration, feel free to adjust it if needed._

## Purpose

_Shine is providing banking services, our users can perform various types of transactions, that's what we will focus on today._

This exercise is using an event-driven approach following a producer-consumer pattern.

We are providing the producer, you will be implementing the **consumer**, located in `src/consumer/index.ts`.  
The goal is to process received events and react according to the business logic.

The producer may send erroneous payload, just like it could happen in a real world environment.

_If something is not clear, feel free to ask questions._

## Expectations

The code should be production-ready.  
We believe it's better to have quality rather than quantity.

## Transaction format

Transaction received are formatted as defined below

```js
{
  "bankAccountId": "5d833d26-97d3-52b9-98ef-fc9085270d63",
  "category": "TAX",
  "userId": "1e8ce3e6-57b9-5aed-9598-ed7dba8ce824",
  "createdAt": "1970-01-04T10:52:25.779Z",
  "currency": "EUR", // will always be `EUR`
  "description": "Transaction description",
  "executedAt": "1970-01-17T00:00:33.146Z",
  "paymentMethod": "DIRECT_DEBIT", // could be one of CARD, CHECK, DIRECT_DEBIT or TRANSFER
  "status": "PENDING", // could be one of PENDING, CANCELED, VALIDATED
  "title": "Transaction title",
  "transactionAt": "1970-01-17T00:00:25.062Z",
  "transactionId": "6fd1e7f4-bbde-5638-8c7f-aab9e0c04757",
  "type": "PAYIN", // PAYIN for incoming transaction or PAYOUT for outgoing transaction
  "updatedAt": "1970-01-04T10:52:27.281Z",
  "value": 5000 // integer, e.g. 5000 equals to 50.00€
}
```

## Goals

1. Store the received transaction using the SQLite database provided in `utils/database.ts`
2. Compute the `balance` per bank account & store it.
3. Compute `nextBalance` per bank account & store it.

### Optional goals

4. Compute a `remainingPaymentCardAmount` for the bank account with a default value **10000 EUR with no limit of time**.
   We should be able to modify the default value for a given bank account later.
