import 'dotenv/config';
import App from './api/app';
import validateEnv from './api/utils/validateEnv';

validateEnv();
const port = process.env.PORT || 7077;
const app = new App(port as number);

app.listen();
