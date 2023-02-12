import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import AuthRoute from './routes/AuthRoute.js';
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import cors from 'cors';

const port = process.env.PORT || 4000;

const app = express();

// middleware
app.use(express.json());
app.use(cors());

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(`DB GOT CONNECTED`))
.catch((error) => console.log(error));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}..`)
})

// routes
app.use('/auth', AuthRoute);
app.use('/user', userRoute);
app.use('/post', postRoute);
