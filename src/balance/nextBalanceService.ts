import { Database } from "sqlite"

export const generateNextBalance = async (transaction: Record<string,string>, db:Database) => {
    const balance= await db.get(`SELECT balance FROM nextBalances WHERE bankAccountId = ?`, transaction.bankAccountId)
    if (isPending(transaction) && balance) {
        console.log(transaction.value)
        const value = balanceToSet(balance,Number(transaction.value),transaction.type)
        const result = await createNextBalanceRecord(transaction,value, db)
        return result
    } else {
        const linkedTransaction = await db.get(`SELECT balance FROM nextBalances WHERE bankAccountId = ? AND transactionId = ?`, transaction.bankAccountId, transaction.transactionId)
        if (linkedTransaction) {
        await removeNextBalanceRecord(transaction, db)
        }

    }
}

export const removeValidatedFromNextBalance = async (transaction: Record<string,string>, db:Database) => {
    await removeNextBalanceRecord(transaction, db)
    
}

const isPending = (transaction: Record<string,string>) => (transaction.status === 'PENDING')

const balanceToSet = (currentBalance: number, sumToCredit: number, type: string):number => (currentBalance + creditSum(type, sumToCredit))

const creditSum = (type: string, sum: number):number => {
  if (type === 'PAYOUT') return -1 * sum
  return 1 * sum
}

const createNextBalanceRecord = async (transaction: Record<string,string>,value: number, db:Database) => {
    return db.run(
        `INSERT INTO nextBalances (bankAccountId, transactionId, userId, balance) VALUES (?,?,?,?)`,transaction.bankAccountId,transaction.transactionId,transaction.userId,value
      )
}

const removeNextBalanceRecord = async (transaction: Record<string,string>, db:Database) => {
    // UPDATE INSTEAD OF DELETE => CURRENT BALANCE - TRANSACTIONID.value
    return db.run(
        `DELETE FROM nextBalances WHERE bankAccountId = ? AND transactionId = ?`, transaction.bankAccountId, transaction.transactionId
      )
}