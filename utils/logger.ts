import pino from 'pino';

export default pino({
  level: process.env.LOG_LEVEL || "warn",
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(process.env.NODE_ENV === "development"
    ? {
      transport: {
        target: 'pino-pretty'
      },
    }
    : {}
  )
});