const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const cors = require('cors')
const jwt = require('jsonwebtoken')

const port = 3000

const JWTsecret = 'smlmlsmlsdmsf56asfkanfdbva5r'

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// MiddleWare

const authToken = (request, response, next) => {
    const authToken = request.headers['authorization']

    if(authToken !== undefined) {
        const bearer = authToken.split(' ')
        const token = bearer[1]

        jwt.verify(token, JWTsecret, (error, data) => {
            if( error ) {
                response.status(401)
                response.json({ error: 'Token inválido'})
            } else {
                request.token = token
                request.loggedUser = { id: data.id, email: data.email }
                next()
            }
        })
        
    } else {
        response.status(401)
        response.json({ error: 'Token inválido'})
    }
}

// Ilustração do banco de dados
const DB = {
    games: [
        {
            id: 1,
            title: 'Call of Duty BO2',
            year: 2012,
            price: 35
        },
        {
            id: 2,
            title: 'Minecraft',
            year: 2011,
            price: 85
        },
        {
            id: 3,
            title: 'Fifa 23',
            year: 2022,
            price: 80
        },
    ],
    users: [
        {
            id: 1,
            name: 'Gabriel Santos',
            email: 'gabilu@gmail.com',
            password: 'node'
        },
        {
            id: 2,
            name: 'Lelê Santana',
            email: 'lele@gmail.com',
            password: 'node'
        }
    ]
}

// Rotas
app.get('/games', authToken, (request, response) => {

    const HATEOAS = [
        {
            href: 'http://localhost:3000/game/0',
            method: 'DELETE',
            rel: 'deleete_game'
        },
        {
            href: 'http://localhost:3000/game/0',
            method: 'GET',
            rel: 'get_game'
        },
        {
            href: 'http://localhost:3000/auth',
            method: 'POST',
            rel: 'login'
        },
    ]

    response.statusCode = 200
    response.json({games: DB.games, _links: HATEOAS })
})

app.get('/game/:id', authToken, (request, response) => {
    const id = request.params.id
    if (isNaN(id)) {
        response.sendStatus(400)
    } else {
        const idNum = parseInt(id)
        const game = DB.games.find(g => g.id === idNum)

        const HATEOAS = [
            {
                href: 'http://localhost:3000/game/'+ idNum,
                method: 'DELETE',
                rel: 'delete_game'
            },
            {
                href: 'http://localhost:3000/game/'+ idNum,
                method: 'PUT',
                rel: 'edit_game'
            },
            {
                href: 'http://localhost:3000/game/'+ idNum,
                method: 'GET',
                rel: 'get_game'
            },
            {
                href: 'http://localhost:3000/games',
                method: 'GET',
                rel: 'get_all_games'
            },
        ]

        if (game != undefined) {
            response.statusCode = 200
            response.json({game, _links: HATEOAS})
        } else {
            response.sendStatus(404)
        }
    }
})

app.post('/game', (request, response) => {
    const { title, year, price } = request.body

    DB.games.push({
        id: 5,
        title,
        year,
        price
    })

    response.sendStatus(200)

})

app.delete('/game/:id', (request, response) => {
    const id = request.params.id
    if (isNaN(id)) {
        response.sendStatus(400)
    } else {
        const idNum = parseInt(id)
        const index = DB.games.findIndex(g => g.id === idNum)

        if (index === -1) {
            response.sendStatus(404)
        } else {
            DB.games.splice(index, 1)
            response.sendStatus(200)
        }
    }
})

app.put('/game/:id', (request, response) => {
    const id = request.params.id
    if (isNaN(id)) {
        return response.sendStatus(400);
    }

    const idNum = parseInt(id);
    const game = DB.games.find(g => g.id === idNum);

    if (!game) {
        return response.sendStatus(404);
    }

    const { title, year, price } = request.body;
    if (title) {
        game.title = title;
    }
    if (year) {
        game.year = year;
    }
    if (price) {
        game.price = price
    }
    
    return response.sendStatus(200);
})

app.post('/auth', (request, response) => {
    const { email, password } = request.body

    if (email !== undefined) {
        const user = DB.users.find(user => user.email === email)
        const auth = user !== undefined && user.password === password

        if (auth) {
            jwt.sign({ id: user.id, email: user.email },
                JWTsecret, { expiresIn: '24h'}, (error, token) => {
                if (error) {
                    response.status(400)
                    response.json({ error: 'Falha interna' })
                } else {
                    response.status(200)
                    response.json({ token: token })
                }
            })
        } else {
            response.status(401)
            response.json({ error: 'Email ou senha incorretos' })
        }

    } else {
        response.status(400)
        response.json({ error: 'Credenciais invalidas' })
    }

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

