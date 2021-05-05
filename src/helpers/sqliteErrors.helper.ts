export function isUniqueConstraintErrorSqlite(error: Error) {
  return (
    error.name === 'QueryFailedError' &&
    error.message.includes('UNIQUE constraint failed')
  );
}

export function isForeignKeyConstraintErrorSqlite(error: Error) {
  return (
    error.name === 'QueryFailedError' &&
    error.message.includes('FOREIGN KEY constraint failed')
  );
}
