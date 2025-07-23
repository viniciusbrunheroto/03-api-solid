import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { User } from "generated/prisma";


interface AuthenticateUseCaseRequest {
    email: string;
    password: string;
}

interface AuthenticateUseCaseResponse {
    user: User
}

export class AuthenticateUseCase {
    constructor(
        private usersRepository: UsersRepository,
    ) {}


    async execute({email, password}: AuthenticateUseCaseRequest):
     Promise<AuthenticateUseCaseResponse> {
        /*
            1. Buscar o usuário no banco de dados pelo email
            2. Verificar se a senha do banco bate com a senha do parâmetro
        */

            const user = await this.usersRepository.findByEmail(email)

            if (!user) {
                throw new InvalidCredentialsError()
            }

            // Boolean => if , has , does
            const doesPasswordMatches = await compare(password, user.password_hash)

            if (!doesPasswordMatches) {
                throw new InvalidCredentialsError()
            }

            return {
                user,
            }
    }
}