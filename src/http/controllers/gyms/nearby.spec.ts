import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'


import {app} from '@/app'
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe('Nearby Gyms (e2e)', () => {

    beforeAll(async() => {
        await app.ready()
    })

    afterAll(async() => {
        await app.close()
    })


    it('should be able to list nearby gyms', async () => {

      const { token } = await createAndAuthenticateUser(app, true)


    
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -22.7389645,
        longitude: -47.6287104,
      })

      await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -22.5521734,
        longitude: -47.9019748,
      })

      const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -22.7389645,
        longitude: -47.6287104,
      })
      .set('Authorization', `Bearer ${token}`)
     

      expect(response.statusCode).toEqual(200)
      expect(response.body.gyms).toHaveLength(1)
      expect(response.body.gyms).toEqual([
        expect.objectContaining({
            title: 'JavaScript Gym'
        })
      ])
     
    })
})