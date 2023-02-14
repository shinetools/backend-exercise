export const transactionInsertQuery = 
  `INSERT INTO transactions (
      transactionId,
      bankAccountId,
      category,
      userId,
      createdAt,
      currency,
      description,
      executedAt,
      paymentMethod,
      status,
      title,
      transactionAt,
      type,
      updatedAt,
      value
  ) VALUES (
      :transactionId,
      :bankAccountId,
      :category,
      :userId,
      :createdAt,
      :currency,
      :description,
      :executedAt,
      :paymentMethod,
      :status,
      :title,
      :transactionAt,
      :type,
      :updatedAt,
      :value
)`;

export const transactionDeleteQuery = 'DELETE FROM transactions WHERE transactionId = ?';