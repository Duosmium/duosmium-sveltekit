import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import type { DatabaseInterface } from './database';

export class Sqlite implements DatabaseInterface {
	private sequelize: Sequelize;
	constructor() {
		dotenv.config();
		if (typeof process.env.DB_FILE !== 'string') {
			throw new Error("SQLite backend chosen, but file is null! Specify a path using the DB_FILE variable.")
		}
		this.sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: process.env.DB_FILE,
			models: [__dirname + '/models.ts'],
		});
	}

	getSequelize(): Sequelize {
		return this.sequelize;
	}
}