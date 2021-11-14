require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const Person = require("./models/person")
const app = express()
morgan.token("show_data", (req, res) => {
  return Object.entries(req.body).length !== 0 ? JSON.stringify(req.body) : " "
})
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :show_data"
  )
)
app.use(express.json())
app.use(express.static("build"))

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
     <p>${new Date()}</p>`
  )
})

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((error) => next(error))
})

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person)
    })
    .catch((error) => next(error))
})

app.post("/api/persons", (req, res, next) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "provide a name and a number" })
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number
  })
  newPerson
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
