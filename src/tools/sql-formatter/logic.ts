import { format } from 'sql-formatter'

export type SqlDialect =
  | 'sql'
  | 'mysql'
  | 'postgresql'
  | 'sqlite'
  | 'mariadb'
  | 'bigquery'

export const DIALECTS: { label: string; value: SqlDialect }[] = [
  { label: 'Standard SQL', value: 'sql' },
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'SQLite', value: 'sqlite' },
  { label: 'MariaDB', value: 'mariadb' },
  { label: 'BigQuery', value: 'bigquery' },
]

export function formatSQL(input: string, dialect: SqlDialect = 'sql', tabWidth = 2): string {
  return format(input, { language: dialect, tabWidth, keywordCase: 'upper' })
}
