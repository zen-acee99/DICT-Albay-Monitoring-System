const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// need ito kapag atlas mongoDB yun gagamitin
const dns = require('dns');
dns.setServers([
    '8.8.8.8',
    '8.8.4.4'
])

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    console.log("Database:", mongoose.connection.name);
})
.catch((err) => {
    console.log("MongoDB Error:", err);
});

const egovphRoutes = require('./routes/egovphRoutes')
const operationalRoutes = require('./routes/operationalRoutes')
const auditTrailRoutes = require('./routes/auditTrailRoutes')
const userRoutes = require('./routes/userRoutes')

app.use('/egovph', egovphRoutes);
app.use('/operational', operationalRoutes);
app.use('/auditTrail', auditTrailRoutes);
app.use('/users', userRoutes);

app.listen(3001, () => {
    console.log('Server is running on port 3001')
})



