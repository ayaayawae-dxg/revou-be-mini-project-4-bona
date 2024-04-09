interface createErrorProp {
  message: string;
  status: number;
}

class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export const createError = ({ message, status }: createErrorProp) => {
  const error = new CustomError(message, status)
  error.status = status
  throw error;
};
