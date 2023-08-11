const mongoose = require('mongoose')
//const url = `mongodb+srv://fullstack:${password}@cluster0.fzmisa1.mongodb.net/?retryWrites=true&w=majority`
const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
console.log('connecting to ', url)
mongoose.connect(url).then((result) => {
    console.log('Connected to MongoDb');
})
    .catch(function (error) {
        console.log('error connecting to MongoDB ', error.message);
    })
const phoneschema = new mongoose.Schema(
    {
        name: {
            type: String,
            minLength: 3,
            required: true
        },
        number: {
            type: String,
            validate: {
                validator: function (v) {
                    //return /\d{2,3}-\d+.test(v);
                    return v.match(/^\d{2,3}-\d+$/mg)
                },
                message: (props) => {
                    console.log('props ', props);
                    return `${props.value} is not a valid phone number!`
                }
            },
        },
    }
)

phoneschema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
module.exports = mongoose.model('Phone', phoneschema)
