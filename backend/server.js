const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
import dotenv from 'dotenv'

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.get('/', (req, res) => {
    
})