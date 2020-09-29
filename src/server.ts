import 'dotenv/config';
import app from './api/app';
import logger from './api/utils/logger';
import db from './api/utils/db';

function startServer() {
	db.open().then(() => {
		const port = process.env.PORT || 7077;
		app.set('port', port);

		app.listen(port, () => {
			logger.info(`App listening on the port ${port}`);
		});
	});
}

startServer();
