import { Database } from "sqlite"


export const createBalance = async () => {

}

export const getBalanceFromBankAccountId = async (db:Database, bankAccountId: string) => {
    return db.get(`SELECT balance FROM balances WHERE bankAccountId = ?`, bankAccountId)
}