import { expect, describe, it, beforeEach} from 'vitest';


import { compare, hash } from 'bcryptjs';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found-error';




// Testes unitários : testam uma unidade isolada do código, como uma função ou método.
// Testes de integração : testam a interação entre diferentes partes do sistema, como serviços, bancos de dados e APIs.

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase



describe('Get User Profile Use Case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)
    })

    it ('should be able to get user profile', async () => { 
       const createdUser =  await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash:await hash('123456',6),
        })

        const {user } = await sut.execute({
          userId:  createdUser.id
        })


        expect(user.id).toEqual(expect.any(String))
        expect(user.name).toEqual('John Doe')
    })

    it ('should not be able to get user profile with wrong id', async () => { 
        await expect(() =>  sut.execute({
           userId:  'non-existing-id'
         })).rejects.toBeInstanceOf(ResourceNotFoundError)
 
     })
})
    
