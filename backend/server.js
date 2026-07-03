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


const egovphRoutes = require('./routes/egovphRoutes')
const operationalRoutes = require('./routes/operationalRoutes')
const auditTrailRoutes = require('./routes/auditTrailRoutes')
const userRoutes = require('./routes/userRoutes')
const EgovActRoutes = require('./routes/egovactRoutes')
const EgovProRoutes = require('./routes/egovproRoutes')
const additionalInfoRoutes = require('./routes/additionalInfoRoutes')
const wifiRoutes = require('./routes/wifiRoutes')
const pnpkiRoutes = require('./routes/pnpkiRoutes')
const ilcdbRoutes = require('./routes/ilcdbRoutes')
const egovRoutes = require('./routes/egovRoutes')
const scheduleCalendar = require('./routes/schedules')
app.use('/egovph', egovphRoutes);
app.use('/operational', operationalRoutes);
app.use('/auditTrail', auditTrailRoutes);
app.use('/users', userRoutes);
app.use('/egovact', EgovActRoutes)
app.use('/egovpro', EgovProRoutes)
app.use('/additionaldescription', additionalInfoRoutes)
app.use('/wifiData', wifiRoutes)
app.use('/pnpki', pnpkiRoutes)
app.use('/ilcdb', ilcdbRoutes)
app.use('/egov', egovRoutes)
app.use('/albayCalendar', scheduleCalendar)


app.get('/', (req, res) => {
    res.send('API is running');
});

app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
})

const PORT = process.env.PORT || 3002;
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    
})
})
.catch((err) => {
    console.log("MongoDB Error:", err);
});


