export class LateCheckInValidationError extends Error {
  constructor() {
    super(
      'O check-in só pode ser validado dentro de 20 minutos depois de sua criação.',
    )
  }
}
