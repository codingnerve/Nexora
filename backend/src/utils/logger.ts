/**
 * Minimal structured logger.
 *
 * Deliberately dependency-free: the API only needs timestamped, levelled lines
 * on stdout/stderr, which any host (PM2, Docker, Render, Railway) will collect.
 */

type Level = "info" | "warn" | "error" | "debug";

const stamp = (): string => new Date().toISOString();

function write(level: Level, message: string, meta?: unknown): void {
  const line = `${stamp()} [NEXORA] [${level.toUpperCase()}] ${message}`;
  const stream = level === "error" || level === "warn" ? console.error : console.log;

  if (meta === undefined) {
    stream(line);
    return;
  }

  // Errors do not serialise usefully with JSON.stringify — unwrap them first.
  if (meta instanceof Error) {
    stream(line, `\n  ${meta.name}: ${meta.message}`, meta.stack ? `\n  ${meta.stack}` : "");
    return;
  }

  stream(line, meta);
}

export const logger = {
  info: (message: string, meta?: unknown) => write("info", message, meta),
  warn: (message: string, meta?: unknown) => write("warn", message, meta),
  error: (message: string, meta?: unknown) => write("error", message, meta),
  debug: (message: string, meta?: unknown) => {
    if (process.env.NODE_ENV !== "production") {
      write("debug", message, meta);
    }
  },
};
