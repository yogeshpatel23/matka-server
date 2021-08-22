const express = require('express')
const mongoose = require('mongoose')
const Cors = require('cors')

const userRoute = require('./routes/user')
const auth = require('./middleware/auth')

// App Config
const app = express()
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json())
app.use(Cors());

// DB Config
const dbuser = process.env.MDB_USER
const dbpass = process.env.MDB_PASS
const dbname = 'testDb'
const db_url = `mongodb+srv://${dbuser}:${dbpass}@cluster0.lo3is.mongodb.net/${dbname}?retryWrites=true&w=majority`
mongoose.connect(db_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

// Routes
app.get("/", (req, res) => {
    res.status(200).send('ok')
})

app.use('/user', userRoute)

app.get('/test', auth, (req, res) => {
    res.send(req.user)
})

// Start server
app.listen(port, () => console.log(`server started on http://localhost:${port}`))