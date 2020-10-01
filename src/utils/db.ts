import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import config from '../config';
import logger from './logger';

mongoose.Promise = global.Promise;

const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
	keepAlive: true,
	keepAliveInitialDelay: 300000,
	autoIndex: true,
	serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
	socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
};

class MongoConnection {
	private static _instance: MongoConnection;

	private _mongoServer?: MongoMemoryServer;

	static getInstance(): MongoConnection {
		if (!MongoConnection._instance) {
			MongoConnection._instance = new MongoConnection();
		}
		return MongoConnection._instance;
	}

	public async open(): Promise<void> {
		try {
			if (config.mongodb.url === 'inmemory') {
				logger.info('connecting to inmemory mongo db');
				this._mongoServer = new MongoMemoryServer();
				const mongoUrl = await this._mongoServer.getUri(true);
				await mongoose.connect(mongoUrl, options);
			} else {
				logger.info('connecting to mongo db: ' + config.mongodb.url);
				mongoose.connect(config.mongodb.url, options);
			}

			mongoose.connection.on('connected', () => {
				logger.info('Mongo: connected');
			});

			mongoose.connection.on('disconnected', () => {
				logger.error('Mongo: disconnected');
			});

			mongoose.connection.on('error', (err) => {
				logger.error(`Mongo:  ${String(err)}`);
				if (err.name === 'MongoNetworkError') {
					setTimeout(function () {
						mongoose.connect(config.mongodb.url, options).catch(() => {});
					}, 5000);
				}
			});
		} catch (err) {
			logger.error(`db.open: ${err}`);
			throw err;
		}
	}

	public async close(): Promise<void> {
		try {
			await mongoose.disconnect();
			if (config.mongodb.url === 'inmemory') {
				await this._mongoServer!.stop();
			}
		} catch (err) {
			logger.error(`db.open: ${err}`);
			throw err;
		}
	}

	public async removeAllDocuments(collection: string): Promise<void> {
		await mongoose.connection.collections[collection].deleteMany({});
	}
}

export default MongoConnection.getInstance();
