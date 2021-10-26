const mongoose = require("mongoose")

if (
  process.argv.length < 3 ||
  process.argv.length === 4 ||
  process.argv.length > 5
) {
  console.log("Usage: node mongo.js password [name number]")
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack-open:${password}@cluster0.a3svv.mongodb.net/phonebook_test?retryWrites=true&w=majority`

mongoose.connect(url)

const Person = mongoose.model("Person", {
  name: String,
  number: String
})

if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log("phonebook:")
    if (persons.length > 0)
      persons.forEach((person) => {
        console.log(person.name + "\t" + person.number)
      })
    else console.log("empty!")
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  const newPerson = new Person({ name, number })
  newPerson.save().then(() => {
    console.log(`${name} added!`)
    mongoose.connection.close()
  })
}
