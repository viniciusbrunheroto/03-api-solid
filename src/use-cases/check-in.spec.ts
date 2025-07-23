import { expect, describe, it, beforeEach, vi} from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './checkin';
import { afterEach } from 'node:test';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';



// Testes unitários : testam uma unidade isolada do código, como uma função ou método.
// Testes de integração : testam a interação entre diferentes partes do sistema, como serviços, bancos de dados e APIs.



let checkInsRepository:   InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase


describe('Check-in Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository )

        await gymsRepository.create({
            id: 'gym-01',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: -22.7389645,
            longitude: -47.6287104,
        })


        vi.useFakeTimers()
    })

    afterEach (() => {
        vi.useRealTimers()
    })



    it ('should be able to check in', async () => { 

        
        const {checkin} = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.7389645,
            userLongitude: -47.6287104,
        })

     
        expect(checkin.id).toEqual(expect.any(String))
    })

    // red, green, refactor 

    it ('should not be able to check in twice in the same day', async () => { 
        vi.setSystemTime(new Date(2022,0,20,8,0,0))
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.7389645,
            userLongitude: -47.6287104,
        })
     
        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.7389645,
            userLongitude: -47.6287104,
        })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it ('should be able to check in twice but in different days', async () => { 
        vi.setSystemTime(new Date(2022,0,20,8,0,0))
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.7389645,
            userLongitude: -47.6287104,
        })

        vi.setSystemTime(new Date(2022,0,21,8,0,0))
     
        const {checkin} =  await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.7389645,
            userLongitude: -47.6287104,
        })

        expect(checkin.id).toEqual(expect.any(String))

    })

    it ('should not be able to check in on distant gym', async () => { 

        gymsRepository.items.push({
            id: 'gym-02',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-22.6769916),
            longitude: new Decimal(-47.6803192),
        })

  
        await expect(() => sut.execute({
            gymId: 'gym-02',
            userId: 'user-01',
            userLatitude: -22.7389645,
            userLongitude: -47.6287104,
        })).rejects.toBeInstanceOf(MaxDistanceError)
    })
})
    
