type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogEntry = {
  id: string
  level: LogLevel
  timestamp: string
  message: string
  context?: Record<string, unknown>
}

class Logger {
  private levelPriority: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
  }

  private currentLevel: LogLevel = 'debug'
  private buffer: LogEntry[] = []
  private maxBufferSize = 2000
  private seq = 0

  setLevel(level: LogLevel) {
    this.currentLevel = level
  }

  private shouldLog(level: LogLevel) {
    return this.levelPriority[level] >= this.levelPriority[this.currentLevel]
  }

  private nextId() {
    this.seq += 1
    return `${Date.now()}-${this.seq}`
  }

  private write(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      id: this.nextId(),
      level,
      timestamp: new Date().toISOString(),
      message,
      context,
    }

    this.buffer.push(entry)
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift()
    }

    if (this.shouldLog(level)) {
      // eslint-disable-next-line no-console
      const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : level === 'info' ? console.info : console.debug
      fn(`[${entry.timestamp}] [${level.toUpperCase()}] ${message}`, context ?? {})
    }

    return entry.id
  }

  debug(message: string, context?: Record<string, unknown>) {
    return this.write('debug', message, context)
  }

  info(message: string, context?: Record<string, unknown>) {
    return this.write('info', message, context)
  }

  warn(message: string, context?: Record<string, unknown>) {
    return this.write('warn', message, context)
  }

  error(message: string, context?: Record<string, unknown>) {
    return this.write('error', message, context)
  }

  getLogs() {
    return [...this.buffer]
  }

  clear() {
    this.buffer = []
  }
}

const logger = new Logger()

;(globalThis as any).__appLogger = logger
;(globalThis as any).__appLogs = () => logger.getLogs()

export default logger
export type { LogEntry, LogLevel }


