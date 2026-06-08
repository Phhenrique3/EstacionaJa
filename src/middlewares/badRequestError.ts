import  AppError  from "../middlewares/AppError";


class badRequestError extends AppError {
    constructor(mensagem = "Requisição incorreta"){
        super(mensagem,400)
    }
}

export default badRequestError