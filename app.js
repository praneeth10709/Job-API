const express=require('express')
const app=express()

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');


const authRouter=require('./routers/auth')
const jobsRouter=require('./routers/jobs')
const {connectDB}=require('./db/connect')
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler.js');
const auth=require('./middleware/authentication.js')
require('dotenv').config()


app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, 
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use(express.json());
const port=3000
app.use(express.static('public'))
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',auth,jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const start= async ()=>{
  try{
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
  }
  catch(err){
    console.log(err)
  }    
}
start()