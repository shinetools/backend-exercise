import { createLogger, format, transports } from 'winston';

const {
  combine, colorize, printf,
} = format;

const logFormat = printf((info) => {
  const { level, message, ...rest } = info;
  const detailsKeys = Object.keys(rest);
  const details = detailsKeys.reduce(
    (acc: Record<string, any>, key) => ({
      ...acc,
      [key]: rest[key],
    }),
    {},
  );

  const baseMessage = `${level}: ${message}`;

  return Object.keys(details).length === 0
    ? baseMessage
    : `${baseMessage}\n${JSON.stringify(details, null, 4)}`;
});

const logger = createLogger({
  level: 'debug',
  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
});

export default logger;
