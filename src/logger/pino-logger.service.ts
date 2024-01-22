import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { pino } from 'pino';
import pretty from 'pino-pretty';
import { ASYNC_STORAGE } from './logger.constants';
import { AsyncLocalStorage } from 'async_hooks';
const logger = pino(pretty());

interface Stringable {
  toString(): string;
}

@Injectable()
export class PinoLoggerService implements LoggerService {
  constructor(
    @Inject(ASYNC_STORAGE)
    private readonly asyncStorage: AsyncLocalStorage<Map<string, string>>,
  ) {}

  private getMessage(message: Stringable, context?: string) {
    return context ? `[ ${context}] ${message}` : message.toString();
  }

  error(message: Stringable, context?: string, trace?: string) {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    logger.error({ traceId }, this.getMessage(message, context));
    if (trace) {
      logger.error({ traceId }, trace);
    }
  }

  log(message: Stringable, context?: string) {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    logger.info({ traceId }, this.getMessage(message, context));
  }

  warn(message: Stringable, context?: string) {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    logger.warn({ traceId }, this.getMessage(message, context));
  }
}
