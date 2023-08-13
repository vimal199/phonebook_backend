const mongoose = require('mongoose')
console.log('Starting')
if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}
const password = process.argv[2]
console.log('password is ', password)
const url = `mongodb+srv://fullstack:${password}@cluster0.fzmisa1.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)
const phoneschema = new mongoose.Schema(
    {
        name: String,
        number: String,
    }
)
const Phone = mongoose.model('Phone', phoneschema)
//
if (process.argv.length === 3) {
    console.log('phonebook')
    Phone.find({}).then(
        (persons) => {
            persons.map(
                (person) => {
                    console.log(person.name, person.number)
                }
            )
            mongoose.connection.close()
        }
    )
}
if (process.argv.length === 5) {
    const phone = new Phone(
        {
            name: process.argv[3],
            number: process.argv[4],
        }
    )
    phone.save().then(
        result => {
            console.log(`added ${result.name} number ${result.number} to phonebook`)
            mongoose.connection.close()
        }
    )
}