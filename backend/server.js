// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// require('dotenv').config();

// // need ito kapag atlas mongoDB yun gagamitin
// const dns = require('dns');
// dns.setServers([
//     '8.8.8.8',
//     '8.8.4.4'
// ])

// const app = express();
// app.use(cors());
// app.use(express.json());


// const egovphRoutes = require('./routes/egovphRoutes')
// const operationalRoutes = require('./routes/operationalRoutes')
// const auditTrailRoutes = require('./routes/auditTrailRoutes')
// const userRoutes = require('./routes/userRoutes')
// const EgovActRoutes = require('./routes/egovactRoutes')
// const EgovProRoutes = require('./routes/egovproRoutes')
// const additionalInfoRoutes = require('./routes/additionalInfoRoutes')
// const wifiRoutes = require('./routes/wifiRoutes')
// const pnpkiRoutes = require('./routes/pnpkiRoutes')
// const ilcdbRoutes = require('./routes/ilcdbRoutes')
// const egovRoutes = require('./routes/egovRoutes')
// const scheduleCalendar = require('./routes/schedules')
// app.use('/albayCalendar', scheduleCalendar)
// app.use('/operational', operationalRoutes);
// app.use('/auditTrail', auditTrailRoutes);
// app.use('/users', userRoutes);
// app.use('/egovact', EgovActRoutes)
// app.use('/egovpro', EgovProRoutes)
// app.use('/additionaldescription', additionalInfoRoutes)
// app.use('/wifiData', wifiRoutes)
// app.use('/pnpki', pnpkiRoutes)
// app.use('/egovph', egovphRoutes);
// app.use('/ilcdb', ilcdbRoutes)
// app.use('/egov', egovRoutes)


// app.get('/', (req, res) => {
//     res.send('API is running');
// });

// app.use((req, res) => {
//     res.status(404).json({ message: 'Endpoint not found' });
// })

// const PORT = process.env.PORT || 3002;
// mongoose.connect(process.env.MONGO_URI)
// .then(() => {
//     console.log("MongoDB Connected");
//     app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`)
    
// })
// })
// .catch((err) => {
//     console.log("MongoDB Error:", err);
// });


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();

// need ito kapag atlas mongoDB yun gagamitin
const dns = require('dns');
dns.setServers([
    '8.8.8.8',
    '8.8.4.4'
]);

const app = express();
app.disable('x-powered-by');

/*
    Security Headers
*/
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
                fontSrc: ["'self'", "https:", "data:"],
                connectSrc: ["'self'"],
                objectSrc: ["'none'"],
                frameAncestors: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"]
            }
        },

        referrerPolicy: {
            policy: "strict-origin-when-cross-origin"
        },

        crossOriginResourcePolicy: {
            policy: "same-origin"
        },

        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        }
    })
);


/*
    CORS
    Replace with your real frontend URL
*/
app.use(cors({
    origin: [
        "https://dict-albay-monitoring-system.vercel.app",
        "http://localhost:5173"
    ],
    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE"
    ],
    credentials: true
}));


app.use(express.json());


// Routes
const egovphRoutes = require('./routes/egovphRoutes');
const operationalRoutes = require('./routes/operationalRoutes');
const auditTrailRoutes = require('./routes/auditTrailRoutes');
const userRoutes = require('./routes/userRoutes');
const EgovActRoutes = require('./routes/egovactRoutes');
const EgovProRoutes = require('./routes/egovproRoutes');
const additionalInfoRoutes = require('./routes/additionalInfoRoutes');
const wifiRoutes = require('./routes/wifiRoutes');
const pnpkiRoutes = require('./routes/pnpkiRoutes');
const ilcdbRoutes = require('./routes/ilcdbRoutes');
const egovRoutes = require('./routes/egovRoutes');
const scheduleCalendar = require('./routes/schedules');
const urlshort = require('./routes/urlRoutes');



app.use('/albayCalendar', scheduleCalendar);
app.use('/albay-urlShortener', urlshort);
app.use('/operational', operationalRoutes);
app.use('/auditTrail', auditTrailRoutes);
app.use('/users', userRoutes);
app.use('/egovact', EgovActRoutes);
app.use('/egovpro', EgovProRoutes);
app.use('/additionaldescription', additionalInfoRoutes);
app.use('/wifiData', wifiRoutes);
app.use('/pnpki', pnpkiRoutes);
app.use('/egovph', egovphRoutes);
app.use('/ilcdb', ilcdbRoutes);
app.use('/egov', egovRoutes);



app.get('/', (req, res) => {
    res.send('API is running');
});


// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint not found'
    });
});


// Global Express error handler
app.use((err, req, res, next) => {
    console.error('Express Server Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, 'server_activity.log');
function syncLog(msg) {
    try {
        fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
    } catch (_) {}
}

// Start server
const PORT = process.env.PORT || 3002;

// Prevent EventEmitter crashes when mongoose connection emits errors or disconnects
mongoose.connection.on('error', (err) => {
    syncLog(`Mongoose connection error: ${err.message || err}`);
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    syncLog('Mongoose disconnected from MongoDB. Reconnecting will occur automatically.');
    console.warn('Mongoose disconnected from MongoDB. Reconnecting will occur automatically.');
});

// Guard against unhandled promise rejections or uncaught exceptions crashing the process
process.on('unhandledRejection', (reason, promise) => {
    syncLog(`Unhandled Rejection: ${reason?.stack || reason}`);
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    syncLog(`Uncaught Exception: ${err.stack || err}`);
    console.error('Uncaught Exception thrown:', err);
});

process.on('exit', (code) => {
    syncLog(`Process exit event received with code: ${code}`);
});

process.on('SIGINT', () => {
    syncLog('Process received SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    syncLog('Process received SIGTERM');
    process.exit(0);
});

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
})
.then(() => {
    syncLog('MongoDB Connected successfully');
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
        syncLog(`Server is running on port ${PORT}`);
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    syncLog(`MongoDB initial connect error: ${err.message || err}`);
    console.log("MongoDB Error:", err);
});