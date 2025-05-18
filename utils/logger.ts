import pino from 'pino';

export default pino({
  level: process.env.LOG_LEVEL,
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: 'pino-pretty'
  },
});