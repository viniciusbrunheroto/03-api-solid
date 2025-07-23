import { expect, describe, it, beforeEach} from 'vitest';
import { RegisterUseCase } from './register';

import { compare } from 'bcryptjs';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';



// Testes unitários : testam uma unidade isolada do código, como uma função ou método.
// Testes de integração : testam a interação entre diferentes partes do sistema, como serviços, bancos de dados e APIs.



let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase


describe('Create Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })

    it ('should be able to create gym', async () => { 
        
        const {gym} = await sut.execute({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -22.7389645,
            longitude: -47.6287104,
        })

      
        expect(gym.id).toEqual(expect.any(String))
    })
})
    
