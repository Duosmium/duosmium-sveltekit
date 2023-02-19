import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import type { DatabaseInterface } from './database';

export class Postgres implements DatabaseInterface {
	private sequelize: Sequelize;
	constructor() {
		dotenv.config()
		if (typeof process.env.DB_DATABASE !== 'string') {
			throw new Error("Postgres backend chosen, but database is null! Specify a database using the DB_DATABASE variable.")
		} else if (typeof process.env.DB_USERNAME !== 'string') {
			throw new Error("Postgres backend chosen, but username is null! Specify a username using the DB_USERNAME variable.")
		} else {
			this.sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
				host: process.env.DB_HOST,
				port: Number(process.env.DB_PORT),
				dialect: 'postgres',
				models: [__dirname + '/models.ts'],
			})
		}
	}

	getSequelize(): Sequelize {
		return this.sequelize;
	}
}