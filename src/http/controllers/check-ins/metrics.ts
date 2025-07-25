import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {

const getUserMetricsUseCase = makeGetUserMetricsUseCase()

const {checkInsCount} = await getUserMetricsUseCase.execute({
     userId: request.user.sub,

    })

  return reply.status(200).send({
    checkInsCount,
  })
}
