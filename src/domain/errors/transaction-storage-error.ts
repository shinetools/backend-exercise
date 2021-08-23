export class TransactionStorageError extends Error {
  constructor(message?: string) {
    super(message ?? 'There was an error trying to store the transaction');
    this.name = TransactionStorageError.name;
  }
}
