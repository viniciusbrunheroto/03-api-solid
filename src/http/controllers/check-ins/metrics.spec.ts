import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'


import {app} from '@/app'
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe('Check-in Metrics (e2e)', () => {

    beforeAll(async() => {
        await app.ready()
    })

    afterAll(async() => {
        await app.close()
    })


    it('should be able to get the total count of check-ins', async () => {

      const { token } = await createAndAuthenticateUser(app)

      const user = await prisma.user.findFirstOrThrow()


      const gym = await prisma.gym.create({
        data: {
            title: 'JavaScript Gym',
            latitude: -22.7389645,
            longitude: -47.6287104,
        }
      })

      const checkIns = await prisma.checkIn.createMany({
        data: [
            {
                gym_id: gym.id,
                user_id: user.id,
            },
            {
                gym_id: gym.id,
                user_id: user.id,
            },
        ],
      })
    
      const response = await request(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send()
     

      expect(response.statusCode).toEqual(200)
      expect(response.body.checkInsCount).toEqual(2)
     
    })
})