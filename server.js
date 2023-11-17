const express = require('express')
const mongoose = require('mongoose')
const productRoute = require('./routers/productRouter')
const categoryRoute = require('./routers/categoryRouter')
const providerRoute = require('./routers/providersRouter')
const clientRoute= require('./routers/clientRouter')
const loginProviderRoute = require('./routers/loginProvider')
const loginClientRoute = require ('./routers/loginClient')
const githubRoute=require('./routers/gitHub')
const resetRoute= require('./routers/resetPassword')
const commentRoute = require('./routers/commentRouter')

const cors= require('cors')
require('dotenv').config();

const PORT = 5050;

const app = express()


app.use(cors({
    origin: 'http://localhost:3000',
  }))
app.use(express.json());
app.use('/', productRoute)
app.use('/', categoryRoute)
app.use('/', providerRoute)
app.use('/', clientRoute)
app.use('/', loginProviderRoute)
app.use('/', loginClientRoute)
app.use('/', githubRoute)
app.use('/', resetRoute)
app.use('/', commentRoute)


const stripe = require('stripe')(`${process.env.STRIPE_KEY}`); 




app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency, payment_method_types } = req.body;

  try {
   
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types,
    });

    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});




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