import winston from 'winston';

const LoggerInstance = winston.createLogger({
	level: 'info',
	levels: winston.config.npm.levels,
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.json()
	),
	transports: [new winston.transports.Console()]
});

export default LoggerInstance;
