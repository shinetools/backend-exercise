import logger from '../../utils/logger';
import { v4 } from 'uuid';
import getDatabase from '../../utils/database';
import { Database } from 'sqlite';
import { Transaction, Validation, ValidationResult } from '../types';
import { transactionInsertQuery } from './utils';

class Storer {
    private _id: string;
    private _initalized: boolean = false;
    private database?: Database;

    constructor() {
        this._id = v4();
        logger.debug(`[Storer:${this._id}] has been instanciated correctly.`);
    }
    
    public async initialize() {
        this.database = await getDatabase();
        logger.debug(`[Storer:${this._id}] initialized.`, this.database);
        const result = await this.database!.run(`
            CREATE TABLE IF NOT EXISTS transactions (
                transactionId TEXT PRIMARY KEY,
                bankAccountId TEXT NOT NULL,
                category TEXT NOT NULL,
                userId TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                currency TEXT NOT NULL,
                description TEXT NOT NULL,
                executedAt TEXT NOT NULL,
                paymentMethod TEXT NOT NULL,
                status TEXT NOT NULL,
                title TEXT NOT NULL,
                transactionAt TEXT NOT NULL,
                type TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                value TEXT NOT NULL
            ) WITHOUT ROWID;
        `);
        this._initalized = true;
        logger.info(`[Storer:${this._id}] initialized with status: ${this.isInitialized === true ? 'successful' : 'failed'}.`);
    }

    public get id() : string {
        return this._id;
    }

    public get isInitialized() : boolean {
        return this._initalized;
    }

    public async getTransactionById(transactionId: string) {
        const result = await this.database!.get('SELECT * FROM transactions WHERE transactionId = ?', transactionId);
        return result;
    }

    public async storeTransaction(transaction: Transaction) {
        logger.debug(`[Storer:${this._id}] new transaction request`, transaction);
        // check db is initialized before even trying to validate a transaction
        if (!this.isInitialized) {
            logger.error(`[Storer:${this._id}] transaction request cannot be done because the Storer is not initialized yet.`);
            throw new Error(`[Storer:${this._id}] transaction request cannot be done because the Storer is not initialized yet.`);
        }
        // validate transaction before storing it
        const validationResult: ValidationResult = this.validateTransaction(transaction);
        if (validationResult.ok === false) {
            logger.error(`[Storer:${this._id}] new transaction (id: ${transaction.transactionId}) has validation errors`, validationResult);
            throw new Error(`[Storer:${this._id}] transaction request cannot be done because the Storer is not initialized yet.`);
        }
        // if valid, proceed by storing in sqlite the transaction
        const result = await this.database!.run(transactionInsertQuery, {
            ":transactionId": transaction.transactionId,
            ":bankAccountId": transaction.bankAccountId,
            ":category": transaction.category,
            ":userId": transaction.userId,
            ":createdAt": transaction.createdAt,
            ":currency": transaction.currency, // will always be `EUR`
            ":description": transaction.description,
            ":executedAt": transaction.executedAt,
            ":paymentMethod": transaction.paymentMethod, // could be one of CARD, CHECK, DIRECT_DEBIT or TRANSFER
            ":status": transaction.status, // could be one of PENDING, CANCELED, VALIDATED
            ":title": transaction.title,
            ":transactionAt": transaction.transactionAt,
            ":type": transaction.type, // PAYIN for incoming transaction or PAYOUT for outgoing transaction
            ":updatedAt": transaction.updatedAt,
            ":value": transaction.value // integer, e.g. 5000 equals to 50.00€
        });
        // if insert query files, an Error is thrown by SQLITE, no need to add a custom handler.
        logger.debug(`[Storer:${this._id}] new transaction (id: ${transaction.transactionId}) stored`, transaction);
        logger.info(`[Storer:${this._id}] new transaction (id: ${transaction.transactionId}) stored.`);
        return result;
    }

    public validateTransaction(transaction: any) : Validation<Transaction> {
        // @TBD: validator as a single reusable component / shareable nodemodule
        // @TBD: validator based on typescript and decorators as for typestack/class-validator
        logger.debug(`[Storer:${this._id}] validating transaction`, transaction);
        if (typeof transaction.value !== "number") {
            return {
                ok: false,
                message: `transaction.value must be of type number but was ${typeof transaction.value}`
            };
        } else if (transaction.value === 0) {
            return { 
                ok: false,
                message: `transaction.value cannot be zero`
            };
        }
        if (transaction.currency !== "EUR") {
            return { 
                ok: false,
                message: `transaction.currency must be EUR`
            };
        }
        return {
            ok: true,
            value: transaction
        };
    }
}

export default Storer;

