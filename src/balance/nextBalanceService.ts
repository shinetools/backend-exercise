import { Database } from "sqlite"

export const updateBalance = async (transaction: Record<string,string>, db:Database) => {
    let currentBalance = await db.get(`SELECT balance,nextBalance FROM balances WHERE bankAccountId = ?`, transaction.bankAccountId)
  
    if (!currentBalance) {
        const emptyBalances = {current: 0, next: 0}
       await createBalanceRecord(transaction, emptyBalances, db)
       currentBalance = {balance: 0, nextBalance: 0}
    }
    let result
    if (isPending(transaction)) {
        const sumToCredit = creditSum(transaction.type, Number(transaction.value))
        const next = currentBalance.nextBalance + sumToCredit
        const balances = {
            current: currentBalance.balance,
            next
        }
        result = await updateBalanceRecord(transaction,balances, db)
    } else if (isCanceled(transaction)) {
        const sumToCancel = creditSum(transaction.type, Number(transaction.value))
        const next = currentBalance.nextBalance - sumToCancel
        const balances = { 
            current: currentBalance.balance,
            next
         }
         result = await updateBalanceRecord(transaction,balances, db)
    } else if (isValid(transaction)) {
        const sumToCredit = creditSum(transaction.type, Number(transaction.value))
        const next = currentBalance.nextBalance - sumToCredit
        const balances = { 
            current: currentBalance.balance + sumToCredit,
            next
         }
         console.log(balances)
         result = await updateBalanceRecord(transaction,balances, db)
    }
    return result
}

const isPending = (transaction: Record<string,string>) => (transaction.status === 'PENDING')
const isCanceled = (transaction: Record<string,string>) => (transaction.status === 'CANCELED')
const isValid = (transaction: Record<string,string>) => (transaction.status === 'VALIDATED')


const creditSum = (type: string, sum: number):number => {
  if (type === 'PAYOUT') return reverseSum(sum)
  return 1 * sum
}

const reverseSum = (sum: number):number => {
    return -1*sum
}

const createBalanceRecord = async (transaction: Record<string,string>,balances: Record<string,number>, db:Database) => {
    return db.run(
        `INSERT INTO balances (bankAccountId, userId, balance, nextBalance) VALUES (?,?,?,?)`,transaction.bankAccountId,transaction.userId,balances.current,balances.next
      )
}

const updateBalanceRecord = async (transaction: Record<string,string>,balances: Record<string,number>, db:Database) => {
    console.log(transaction.bankAccountId)
    console.log(balances.current, balances.next)
    return db.run(
        `UPDATE balances SET balance = ?, nextBalance = ? WHERE bankAccountId = ?`, transaction.bankAccountId, balances.current, balances.next
      )
}