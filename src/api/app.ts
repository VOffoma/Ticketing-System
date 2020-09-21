import express from 'express';
import mongoose from 'mongoose';

class App {
	public app: express.Application;

	public port: number;

	constructor(port: number) {
		this.app = express();
		this.port = port;
		App.connectToDatabase();
	}

	private static connectToDatabase(): void {
		const options = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		};
		const databaseURL = process.env.MONGODB_URL as string;
		mongoose.connect(databaseURL, options);
		mongoose.connection.on('error', (error) => console.log(error));
	}

	public listen(): void {
		this.app.listen(this.port, () => {
			console.log(`App listening on the port ${this.port}`);
		});
	}
}

export default App;
