import { mysqlTableCreator } from 'drizzle-orm/mysql-core';
import { type MySqlTableFn } from 'drizzle-orm/mysql-core';

export * from '~/server/db/schema/user'

export const mysqlTable: MySqlTableFn = mysqlTableCreator((name) => `utkarsh-portal_${name}`);
