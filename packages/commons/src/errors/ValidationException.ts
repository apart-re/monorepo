import _ from 'lodash'

import { ValidationError } from './Errors'
import type { CustomError } from './interfaces/CustomError'

const DEFAULT_KEYWORD = 'error'

const createFromDataPath = (error: any) => {
  const { message, data, instancePath, params = {} } = error
  const { allowedValues } = params

  const key = instancePath.replace('/', '')
  let messageWithKey = `${key}: ${message}`

  if (!_.isEmpty(allowedValues)) {
    messageWithKey = `${messageWithKey} [${allowedValues}];`
  }

  return { message: messageWithKey, data: { [key]: data } }
}

const createFromKeyword = ({ params, message }: any) => {
  const messageWithKey = Object.values(params as Record<string, unknown>).reduce((msg, value) => `${msg as string}${value as string}: ${message};`, '')

  return { message: messageWithKey, data: {} }
}

const mapErrors = (errors: any[], code: string) =>
  errors.reduce((arrayResult, error) => {
    const { instancePath } = error

    const errorObj = !instancePath || instancePath === '' ? createFromKeyword(error) : createFromDataPath(error)

    return [...arrayResult, { code, ...errorObj }]
  }, [])

export class ValidationException extends Error implements CustomError {
  public status: number

  public code: string

  public message: string

  public validationErrors: any[]

  constructor(properties?: { status?: 400; code?: string; errors?: any[] }) {
    const { status = 400, code = ValidationError.code, errors = [] } = properties || {}
    super(ValidationError.code)
    this.status = status
    this.code = code
    this.message = ValidationError.message
    this.validationErrors = mapErrors(errors, code)
  }

  static buildFromMessage(message: string) {
    return new ValidationException({
      errors: [{ keyword: DEFAULT_KEYWORD, message, params: {} }],
    })
  }
}
