export class BalanceComputingError extends Error {
  constructor(message?: string) {
    super(message ?? 'There was an error computing balance');
    this.name = BalanceComputingError.name;
  }
}
