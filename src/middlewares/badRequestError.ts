import  AppError  from "./appError";


class badRequestError extends AppError {
    constructor(mensagem = "Requisição incorreta"){
        super(mensagem,400)
    }
}

export default badRequestError