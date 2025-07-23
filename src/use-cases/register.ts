import { prisma } from '@/lib/prisma'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from 'generated/prisma'

/*
 SOLID 
 D - Dependency Inversion Principle
 Inverter a ordem de como a dependência chega no caso de uso
 Em vez de a classe instanciar as dependências, elas são passadas como parâmetros
*/

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

   // const prismaUsersRepository = new PrismaUsersRepository()

   const user = await this.usersRepository.create({
      name,
      email,
      password_hash
    })

    return {user}
  }
}
