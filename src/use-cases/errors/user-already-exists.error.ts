export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Este endereço de e-mail já está em uso.')
  }
}
