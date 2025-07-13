import winston, { format } from 'winston'

export const logger = winston.createLogger({
  level: 'info', // mức log tối thiểu
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ level, message, timestamp, stack }) => {
      return stack ? `[${timestamp}] [${level}]: ${stack}` : `[${timestamp}] [${level}]: ${message}`
    })
  ),
  transports: [
    new winston.transports.Console() // log ra console
  ]
})
