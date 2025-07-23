import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../../middlewares/verify-jwt'
import { search } from './search'
import { nearby } from './nearby'
import { create } from './create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)


    app.get('/gyms/search', search)
    app.get('/gyms/nearby', nearby)

    app.post('/gyms', {onRequest: [verifyUserRole('ADMIN')]}, create)
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
Header (cabeçalho): Authorization: Bearer 


estratégias para invalidação do token

1) Data de expiração do token
comparação de datas

2) Refresh Token
segundo token 
ao fazer login -> 1º jwt - acessivel pelo front end
geração de 2º jwt (com data de expiração maior) que servirá para renovação /
revalidação do token original - encriptado para o front end não poder ver/acessar



*/