import { FastifyInstance } from 'fastify'
import { RegisterController } from './controllers/register'
import { AuthenticateController } from './controllers/authenticate'

export class Routes {
  static async auth(app: FastifyInstance) {
    app.post('/register', new RegisterController().execute)
    app.post('/login', new AuthenticateController().execute)
  }
}
