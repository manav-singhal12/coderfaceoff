import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';




const app=express();

app.use(cors({
    origin:"*",
    credentials:true
}));

app.use(express.json({
    limit:"50kb",
}));

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());


//authentication routes
import userRouter from './src/routes/user.routes.js'
app.use('/api/user',userRouter);

import accountRouter from './src/routes/account.routes.js'
app.use('/api/account',accountRouter);

import paymentRouter from './src/routes/payment.route.js';
app.use('/api/payment',paymentRouter);

import limitRouter from './src/routes/limit.routes.js';
app.use('/api/limit',limitRouter);

export{app};