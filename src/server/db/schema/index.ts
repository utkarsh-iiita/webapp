import { mysqlTableCreator } from 'drizzle-orm/mysql-core';

export * from '~/server/db/schema/user'

export const mysqlTable = mysqlTableCreator((name) => `utkarsh-portal_${name}`);
