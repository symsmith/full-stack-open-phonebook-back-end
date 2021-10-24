const express = require("express")
const morgan = require("morgan")
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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
     <p>${new Date()}</p>`
  )
})

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === Number(req.params.id))
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

const RANGE = 1000000000

const generateId = () => Math.floor(Math.random() * RANGE)

app.post("/api/persons", (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "provide a name and a number" })
  }
  if (persons.find((p) => p.name.toLowerCase() === body.name.toLowerCase())) {
    return res.status(400).json({ error: "name must be unique" })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  res.json(person)
})

app.delete("/api/persons/:id", (req, res) => {
  persons = persons.filter((p) => p.id !== Number(req.params.id))
  res.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
