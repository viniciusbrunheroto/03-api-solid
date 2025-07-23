import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { refresh } from './refresh'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)
  
  
  /* Authenticated */
  app.get('/me', {onRequest: [verifyJWT]} ,profile)
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