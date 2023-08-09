const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())
/*const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method);
    console.log('Path: ', request.path);
    console.log('Body: ', request.body);
    console.log('---');
    next()
}
app.use(requestLogger)*/
//app.use(morgan('combined'))
morgan.token('body', request => JSON.stringify(request.body))
app.use(morgan(':method :url :body'))
let phonedata = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
app.get(
    '/api/persons', (request, response) => {
        response.json(phonedata)
    }
)
app.get(
    '/info', (request, response) => {
        response.send(
            `<p> Phonebook has info for ${phonedata.length} people <br/> ${new Date()}`
        )
    }
)
app.get(
    '/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        const Person = phonedata.find(
            (pers) => {
                return pers.id === id;
            }
        )
        console.log('searched person ', Person);
        if (Person) {
            response.json(Person)
        } else {
            response.status(404).end()
        }
    }
)
app.delete(
    '/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        phonedata = phonedata.filter(
            (data) => {
                return data.id !== id
            }
        )
        console.log('Array after deletion', phonedata);
        response.status(204).end
    }
)
app.post(
    '/api/persons', (request, response) => {
        console.log('Entering get');
        const maxId = phonedata.length > 0 ? Math.max(...phonedata.map(n => n.id)) : 0
        const person = request.body
        if (!person.name || !person.number) {
            return response.status(400).json(
                {
                    error: 'Name or Nmber is missing'
                }
            )
        }
        const dataexist = phonedata.find(
            (data) => {
                return data.name === person.name
            }
        )
        if (dataexist) {
            return response.status(400).json(
                {
                    error: 'Duplicate data already exists'
                }
            )
        }
        person.id = maxId + 1
        phonedata = phonedata.concat(person)
        response.json(person)
    }
)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}
)
