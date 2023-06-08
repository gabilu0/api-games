# API de games
Essa API pode ser utilizada em seu site para retornar, editar e apagar jogos.

## Endpoints
### GET /games
Esse endpoint retorna a listagem de jogos cadastrados.
#### Parametros
Nenhum.

#### Respostas
200: OK! - Retorna a listagem de todos os jogos.

###### Resposta
```
[
    {
        "id": 1,
        "title": "Call of Duty BO2",
        "year": 2012,
        "price": 35
    },
    {
        "id": 2,
        "title": "Minecraft",
        "year": 2011,
        "price": 85
    },
    {
        "id": 3,
        "title": "Fifa 23",
        "year": 2022,
        "price": 80
    }
]
```

401: Falha na autenticação - Token inválido ou expirado. 

###### Resposta
```
{
    "error": "Token inválido"
}
```
----------

### POST /auth
Esse endpoint é responsavel pelo processo de login do usuário.
#### Parametros
email: E-mail do usuário cadastrado.

password: Senha do usuário cadastrado.

###### Exemplo: 
```
{
    "email" : "gabilu@gmail.com",
    "password": "node"
}
```

#### Respostas
200: OK! - O usuário recebe uma token JWT para acessar endpoints protegidos na API

###### Resposta
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJnYWJpbHVAZ21haWwuY29tIiwiaWF0IjoxNjg2MTg1NDMwLCJleHAiOjE2ODYyNzE4MzB9.kije1hcDjGS_WrbeUN7QcCWP3Jmp0-SP7bMphde9rKs"
}
```

401 ou 400: Falha na autenticação do usuário - Senha ou e-mail incorretos

###### Resposta
```
{ error: 'Email ou senha incorretos' }
```








