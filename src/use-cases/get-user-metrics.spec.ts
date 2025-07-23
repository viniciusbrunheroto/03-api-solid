import { expect, describe, it, beforeEach, vi} from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { GetUserMetricsUseCase } from './get-user-metrics';



// Testes unitários : testam uma unidade isolada do código, como uma função ou método.
// Testes de integração : testam a interação entre diferentes partes do sistema, como serviços, bancos de dados e APIs.



let checkInsRepository:   InMemoryCheckInsRepository

let sut: GetUserMetricsUseCase


describe('Get User Metrics Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()

        sut = new GetUserMetricsUseCase(checkInsRepository )

    })


    it ('should be able to get check-ins count from metrics', async () => { 

        await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })

        await checkInsRepository.create({
            gym_id: 'gym-02',
            user_id: 'user-01',
        })

        const {checkInsCount} = await sut.execute({
            userId: 'user-01',
        })

     
        expect(checkInsCount).toEqual(2)
    })

   
})
    
