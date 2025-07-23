import { prisma } from '@/lib/prisma'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { Gym, User } from 'generated/prisma'
import { GymsRepository } from '@/repositories/gyms-repository'

/*
 SOLID 
 D - Dependency Inversion Principle
 Inverter a ordem de como a dependência chega no caso de uso
 Em vez de a classe instanciar as dependências, elas são passadas como parâmetros
*/

interface CreateGymUseCaseRequest {
    title: string
    description: string | null
    phone: string | null
    latitude: number
    longitude: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({title,description,phone,latitude,longitude}: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {

    const gym = await this.gymsRepository.create({
        title,
        description,
        phone,
        latitude,
        longitude
    })

    
    return {gym}
  }
}
