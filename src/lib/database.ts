import dotenv from 'dotenv';
import { Sqlite } from './sqlite';
import { Postgres } from './postgres';
import type { Sequelize } from 'sequelize-typescript';

export interface DatabaseInterface {
	getSequelize(): Sequelize
}

dotenv.config()

const dbBackend = process.env.DB_BACKEND ? process.env.DB_BACKEND : 'postgres'

let db;
if (dbBackend === 'sqlite') {
	db = new Sqlite();
} else if (dbBackend === 'postgres') {
	db = new Postgres();
} else {
	throw new Error("No database backend provided!")
}

export const database = db;
