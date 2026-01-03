import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;

    // Add metadata if present
    const metaKeys = Object.keys(metadata);
    if (metaKeys.length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }

    // Add stack trace for errors
    if (stack) {
        msg += `\n${stack}`;
    }

    return msg;
});

// Create the logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: combine(
        errors({ stack: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports: [
        // Console output (format is inherited from logger config)
        new winston.transports.Console(),
    ],
});

// Add file transports in production
if (process.env.NODE_ENV === "production") {
    logger.add(
        new winston.transports.File({
            filename: "logs/error.log",
            // level: "error", // Not supported in FileTransportOptions
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    );

    logger.add(
        new winston.transports.File({
            filename: "logs/combined.log",
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    );
}

export default logger;
