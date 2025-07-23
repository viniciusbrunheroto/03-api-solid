import { expect, describe, it, beforeEach, vi} from 'vitest';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';



// Testes unitários : testam uma unidade isolada do código, como uma função ou método.
// Testes de integração : testam a interação entre diferentes partes do sistema, como serviços, bancos de dados e APIs.



let gymsRepository:   InMemoryGymsRepository

let sut: SearchGymsUseCase


describe('Search Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()

        sut = new SearchGymsUseCase(gymsRepository)

    })



    it ('should be able to search for gyms', async () => { 

        await gymsRepository.create({
           title: 'JavaScript Gym',
           description: null,
           phone: null,
           latitude: -22.7389645,
           longitude: -47.6287104,
        })

        await gymsRepository.create({
           title: 'TypeScript Gym',
           description: null,
           phone: null,
           latitude: -22.7389645,
           longitude: -47.6287104,
        })

        const {gyms} = await sut.execute({
            query: 'JavaScript',
            page: 1,
        })

     
        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({title: 'JavaScript Gym'}),
        ])
    })

    it ('should be able to fetch paginated gyms search', async () => { 

      for (let i =  1 ; i<= 22; i++) {
        await gymsRepository.create({
            title: `JavaScript Gym ${i}`,
           description: null,
           phone: null,
           latitude: -22.7389645,
           longitude: -47.6287104,
        })
    }


        const {gyms} = await sut.execute({
            query: 'JavaScript',
            page: 2,
        })

     
        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({title: 'JavaScript Gym 21'}),
            expect.objectContaining({title: 'JavaScript Gym 22'}),
        ])
    })
})
    
