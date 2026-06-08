import AppError from "../middlewares/AppError";

class  validationError extends AppError { 
    constructor(mensagem = "Erros de dados enviados"){
        super(mensagem, 400)
    }
}

export default validationError