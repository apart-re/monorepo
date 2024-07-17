import { CLIENT_HOST } from '../../../configs/app-config'

const verifyEmailTemplate = (token: string) => `Hi please verify your email ${CLIENT_HOST}/v1/account/verify?token=${token}`

export default verifyEmailTemplate
