import http from 'node:http'
import type { Worker } from 'node:cluster'
import cluster from 'node:cluster'
import type { ConsumerConfig } from '@apart-re/notify'
import { Consumer } from '@apart-re/notify'
import _ from 'lodash'
import { SERVER_PORT } from './configs/app-config'
import { handlersByName, WorkersConfig } from './configs/workers-config'
import type { LogLevels } from './utils'
import { getLogger, TerminationHandler } from './utils'

const logger = getLogger('Notifications Workers')

const stayAlive = (ms: number) => setTimeout(_.noop, ms)

process.on('unhandledRejection', (reason) => {
  throw reason
})

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Error ${JSON.stringify(error)}`)
  logger.error(error.stack)
})

if (cluster.isPrimary) {
  cluster.setupPrimary({ silent: false })
  cluster.on('setup', (config) => {
    logger.debug('Workers Setup:', config)
  })

  const workers: Worker[] = []
  _.filter(WorkersConfig, ['active', true]).forEach((config) => {
    const w = cluster.fork()
    w.send(config)
    workers.push(w)
  })

  const server = http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200)
      res.end('Ok')
    }
  })
  server.listen(SERVER_PORT, () => {
    console.log(`Health check server running at 0.0.0.0:${SERVER_PORT}`)
  })

  cluster.on('message', (worker: Worker, msg: { cmd: string; loggerName: string; logLevel: LogLevels; logs: string[] }) => {
    if (msg.cmd && msg.cmd === 'log') {
      const loggerName = `${msg.loggerName} (wrkr: ${worker.id})`
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      getLogger(loggerName)[msg.logLevel](...msg.logs)
    }
  })

  TerminationHandler.init()
  TerminationHandler.registerTerminationCallBack(async () => {
    workers.forEach((w) => {
      w.kill()
    })
    stayAlive(100000)
  })
} else {
  process.on('message', (config: ConsumerConfig) => {
    TerminationHandler.init()
    logger.info(config)
    Consumer.startClusterConsumerGroup(config.groupId, {
      ...config,
      topics: config.topics.map((topicConfig) => ({
        ...topicConfig,
        handler: _.get(handlersByName, topicConfig.handlerName),
      })),
    })
  })
}
