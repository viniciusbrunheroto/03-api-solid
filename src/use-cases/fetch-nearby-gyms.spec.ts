import { expect, describe, it, beforeEach, vi} from 'vitest';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';



// Testes unitários : testam uma unidade isolada do código, como uma função ou método.
// Testes de integração : testam a interação entre diferentes partes do sistema, como serviços, bancos de dados e APIs.



let gymsRepository:   InMemoryGymsRepository

let sut: FetchNearbyGymsUseCase


describe('Fetch Nearby Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()

        sut = new FetchNearbyGymsUseCase(gymsRepository)

    })



    it ('should be able to fetch nearby gyms', async () => { 

        await gymsRepository.create({
           title: 'Near Gym',
           description: null,
           phone: null,
           latitude: -22.7389645,
           longitude: -47.6287104,
        })

        await gymsRepository.create({
           title: 'Far Gym',
           description: null,
           phone: null,
           latitude: -22.5521734,
           longitude: -47.9019748,
        })

        const {gyms} = await sut.execute({
            userLatitude: -22.7389645,
            userLongitude: -47.6287104,
        })

     
        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({title: 'Near Gym'}),
        ])
    })

})
    
