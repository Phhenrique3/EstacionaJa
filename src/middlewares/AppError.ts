class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string = "Erro interno no servidor", statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

export default AppError;