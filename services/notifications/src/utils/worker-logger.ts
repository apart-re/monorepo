import cluster from 'node:cluster'
import type { Logger } from 'log4js'
import { getLogger as log4jsGetLoger, configure } from 'log4js'
import { LOG_LEVEL } from '../configs/app-config'

configure({
  appenders: {
    console: { type: 'console', layout: { type: 'colored' } },
  },
  categories: {
    default: { appenders: ['console'], level: LOG_LEVEL },
  },
})

export type LogLevels = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
export const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']

export const getLogger = (loggerName: string): Record<string, (logs: unknown) => void> | Logger => {
  if (cluster.isPrimary) return log4jsGetLoger(loggerName)

  return LOG_LEVELS.reduce((logger, logLevel) => {
    const log = (...logs: unknown[]) => {
      cluster.worker?.send({
        cmd: 'log',
        logLevel,
        loggerName,
        logs,
      })
    }

    return { ...logger, [logLevel]: log }
  }, {})
}
