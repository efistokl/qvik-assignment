export function isUniqueConstraintErrorSqlite(error: Error) {
  return (
    error.name === 'QueryFailedError' &&
    error.message.includes('UNIQUE constraint failed')
  );
}
