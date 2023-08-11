require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Phone = require('./models/phone')
const morgan = require('morgan')
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
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
/*let phonedata = [
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
]*/
app.get(
    '/api/persons', (request, response, next) => {
        Phone.find({}).then(
            (persons) => {
                response.json(persons)
            }
        )

    }
)
app.get(
    '/info', (request, response, next) => {
        Phone.find({}).then(
            (phonedata) => {
                response.send(
                    `<p> Phonebook has info for ${phonedata.length} people <br/> ${new Date()}`
                )
            }
        ).catch((error) => { next(error) })
    }
)
app.get(
    '/api/persons/:id', (request, response, next) => {
        const id = request.params.id
        /*const Person = phonedata.find(
            (pers) => {
                return pers.id === id;
            }
        )*/
        Phone.findById(id).then(
            person => {
                if (person) {
                    response.json(person)
                } else {
                    response.status(404).end()
                }
            }
        ).catch(
            (error) => {
                console.log(error)
                next(error)
            }
        )
        // console.log('searched person ', person);
        /*if (Person) {
            response.json(Person)
        } else {
            response.status(404).end()
        }*/
    }
)
app.delete(
    '/api/persons/:id', (request, response, next) => {
        /*const id = Number(request.params.id)
        phonedata = phonedata.filter(
            (data) => {
                return data.id !== id
            }
        )
        console.log('Array after deletion', phonedata);
        response.status(204).end*/
        Phone.findByIdAndRemove(request.params.id)
            .then(
                (result) => {
                    response.status(204).end()
                }
            ).catch(error => next(error))
    }
)
app.post(
    '/api/persons', (request, response, next) => {
        console.log('Entering post');
        const person = request.body
        if (!person.name || !person.number) {
            return response.status(400).json(
                {
                    error: 'Name or Nmber is missing'
                }
            )
        }
        /*const dataexist = phonedata.find(
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
        }*/
        const phone = new Phone(
            {
                name: person.name,
                number: person.number,
            }
        )
        phone.save().then(
            (savedPhone) => {
                response.json(savedPhone)
            }
        ).catch(
            error => next(error)
        )

    }
)
app.put('/api/persons/:id', (request, response, next) => {
    const input_phone = request.body
    const updates_phone = {
        name: input_phone.name,
        number: input_phone.number,
    }
    Phone.findByIdAndUpdate(request.params.id, updates_phone, { new: true, runValidators: true, context: 'query' })
        .then(
            out_phone => {
                response.json(out_phone)
            }
        ).catch(
            error => next(error)
        )

}
)
// error middleware
const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        console.log('sdsdsdds');
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}
)
