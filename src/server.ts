import 'dotenv/config';
import app from './api/app';
import logger from './utils/logger';
import db from './utils/db';
import config from './config';

function startServer() {
	db.open().then(() => {
		const port = config.port || 7077;
		app.set('port', port);

		app.listen(port, () => {
			logger.info(`App listening on the port ${port}`);
		});
	});
}

startServer();
