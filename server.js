const express = require('express')
const mongoose = require('mongoose')
const productRoute = require('./routers/productRouter')
const categoryRoute = require('./routers/categoryRouter')
const providerRoute = require('./routers/providersRouter')
const basketRoute= require('./routers/basketRouter')
const clientRoute= require('./routers/clientRouter')

const cors= require('cors')
require('dotenv').config();

const PORT = 5050;

const app = express()

app.use(cors())
app.use(express.json());
app.use('/', productRoute)
app.use('/', categoryRoute)
app.use('/', providerRoute)
app.use('/', basketRoute)
app.use('/', clientRoute)

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error during db connect'));
db.once('open', () => {
    console.log('database connection');
});

app.listen(PORT, () => {
    console.log(`server up and running on port ${PORT}`);
});