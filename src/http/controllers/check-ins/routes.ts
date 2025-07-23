import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../../middlewares/verify-jwt'
import { create } from './create'
import { validate } from './validate'
import { metrics } from './metrics'
import { history } from './history'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'


export async function checkInsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)
    
    app.get('/check-ins/history', history)
    app.get('/check-ins/metrics', metrics)

    app.post('/gyms/:gymId/check-ins', create)

    app.patch('/check-ins/:checkInId/validate', {onRequest: [verifyUserRole('ADMIN')]},validate)


}


/* estratégias para autenticação:

1. Basic auth
em todas as requisições são enviadas as credenciais do usuário no cabeçalho

Authorization: Basic (credenciais em base 64 no formato usuario:senha)


2. JWT 
JSON WEB TOKEN
stateless token: sem estado - não armazenado em nenhuma estrutura de persistência de dados

usuario faz login, envia email e senha, o backend cria um token ÚNICO e não-modificável
e stateless

Back-end: Quando vai criar o token ele usa uma PALAVRA-CHAVE (string)

Email/senha -> header.payload.sign

Login => JWT

JWT => Todas requisições dali para frente
Header (cabeçalho): Authorization: Bearer */