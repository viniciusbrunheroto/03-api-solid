import { expect, describe, it, beforeEach, vi} from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history';



// Testes unitários : testam uma unidade isolada do código, como uma função ou método.
// Testes de integração : testam a interação entre diferentes partes do sistema, como serviços, bancos de dados e APIs.



let checkInsRepository:   InMemoryCheckInsRepository

let sut: FetchUserCheckInsHistoryUseCase


describe('Fetch User Check-in History Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()

        sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository )

    })



    it ('should be able to fetch in history', async () => { 

        await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })

        await checkInsRepository.create({
            gym_id: 'gym-02',
            user_id: 'user-01',
        })

        const {checkIns} = await sut.execute({
            userId: 'user-01',
            page: 1,
        })

     
        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({gym_id: 'gym-01'}),
            expect.objectContaining({gym_id: 'gym-02'}),
        ])
    })

    it ('should be able to fetch paginated check-in history', async () => { 

      for (let i =  1 ; i<= 22; i++) {
        await checkInsRepository.create({
            gym_id: `gym-${i}`,
            user_id: 'user-01',
        })
    }


        const {checkIns} = await sut.execute({
            userId: 'user-01',
            page: 2,
        })

     
        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({gym_id: 'gym-21'}),
            expect.objectContaining({gym_id: 'gym-22'}),
        ])
    })
})
    
