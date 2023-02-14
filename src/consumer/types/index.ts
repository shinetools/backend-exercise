export enum TransactionType {
    Payin = 'PAYIN',
    Payout = 'PAYOUT',
};

export enum TransactionStatus {
    Canceled = 'CANCELED',
    Pending = 'PENDING',
    Validated = 'VALIDATED',
};

export enum PaymentMethod {
    Card = 'CARD',
    Check = 'CHECK',
    DirectDebit = 'DIRECT_DEBIT',
    Transfer = 'TRANSFER',
};

export const TransactionCategories: string[] = [
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
];

export interface Transaction {
    "bankAccountId": string, // "5d833d26-97d3-52b9-98ef-fc9085270d63",
    "category": typeof TransactionCategories[number], // "TAX"
    "userId": string, // "1e8ce3e6-57b9-5aed-9598-ed7dba8ce824",
    "createdAt": string, // "1970-01-04T10:52:25.779Z",
    "currency": string, // will always be `EUR`
    "description": string, // "Transaction description",
    "executedAt": string, // "1970-01-17T00:00:33.146Z",
    "paymentMethod": PaymentMethod, // could be one of CARD, CHECK, DIRECT_DEBIT or TRANSFER
    "status": TransactionStatus, // "PENDING", // could be one of PENDING, CANCELED, VALIDATED
    "title": string, // "Transaction title",
    "transactionAt": string, // "1970-01-17T00:00:25.062Z",
    "transactionId": string, // "6fd1e7f4-bbde-5638-8c7f-aab9e0c04757",
    "type": TransactionType, // "PAYIN", // PAYIN for incoming transaction or PAYOUT for outgoing transaction
    "updatedAt": string, // "1970-01-04T10:52:27.281Z",
    "value": number, // 5000 // integer, e.g. 5000 equals to 50.00€
};

export type Validation<T> = { ok: true, value: T } | { ok: false, message: string };

export interface ValidationResult {
    ok: boolean,
    value?: Transaction,
    message?: string,
};