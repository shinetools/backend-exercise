import logger from '../../utils/logger';
import { v4 } from 'uuid';
import getDatabase from '../../utils/database';
import { Database } from 'sqlite';
import { Transaction } from '../types';

class Storer {
    private _id: string;
    private database?: Database;

    constructor() {
        this._id = v4();
        logger.debug(`[Storer:${this._id}] has been instanciated correctly.`);
    }
    
    public async initialize() {
        this.database = await getDatabase();
        logger.debug(`[Storer:${this._id}] initialized.`, this.database);
        // ?? persistance de la table "transactions" -- one time
        logger.info(`[Storer:${this._id}] initialized with status: ${this.isInitialized === true ? 'successful' : 'failed'}.`);
    }

    public get id() {
        return this._id;
    }

    public get isInitialized() {
        return typeof this.database !== 'undefined';
    }

    public async getAllTransactionsId() {
        const result = await this.database!.get('SHOW tables');
        console.log(result);
    }

    public async storeTransaction(transaction: Transaction) {
        logger.debug(`[Storer:${this._id}] new transaction request`, transaction);
        if (!this.isInitialized) {
            logger.error(`[Storer:${this._id}] transaction request cannot be done because the Storer is not initialized yet.`);
            return false;
        }
        // const result = await this.database!.run(
        //     'INSERT INTO transactions (col) VALUES (?)',
        //     '...'
        // );
    }
}

export default Storer;

