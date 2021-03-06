import dotenvExtended from 'dotenv-extended';
import dotenvParseVariables from 'dotenv-parse-variables';

const env = dotenvExtended.load({
	path: process.env.ENV_FILE,
	defaults: './config/.env.defaults',
	schema: './config/.env.schema',
	includeProcessEnv: true,
	silent: false,
	errorOnMissing: true,
	errorOnExtra: true
});

const parsedEnv = dotenvParseVariables(env);

interface Config {
	port: number;
	mongodb: {
		url: string;
	};
	JWTSecret: string;
}

const config: Config = {
	port: parsedEnv.PORT as number,
	mongodb: {
		url: parsedEnv.MONGODB_URL as string
	},
	JWTSecret: parsedEnv.JWTSECRET
};

export default config;
