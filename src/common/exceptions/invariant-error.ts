import ClientError from "./client-error"

class InvariantError extends ClientError {
  constructor(public message: string) {
    super(message)
  }
}

export default InvariantError
