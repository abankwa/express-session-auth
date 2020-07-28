const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { v4: uuidv4 } = require('uuid')
const Session = require('./models/Session')
const User = require('./models/User')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const  test  = require('./routes/test')

app.use('/pp',test)


dotenv.config()

//connect to DB
mongoose.connect('mongodb+srv://dbuser:pass123@cluster0.3bsqd.mongodb.net/rest?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(console.log('db connected'))
//mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true ,useUnifiedTopology: true}).then(console.log('db connected'))


//Middleware
app.use(bodyParser.urlencoded({ extended: false })) //parse form data body
//app.use(bodyParser.json())                    //parse json body
app.use(cookieParser());                        //parse cookie

//template engine
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx')
app.engine('jsx', require('express-react-views').createEngine());


//Serve Static Files
app.use(express.static('public'))


app.get('/', async (req, res, next) => {
    
    if (await sessionExists(req)) {
        res.redirect('/dashboard')
    } else {
        res.render('Home', { name: 'John' })
    }
})

app.get('/dashboard', async (req, res, next) => {
    if (await sessionExists(req)) {
        res.render('Dashboard', { user: app.locals.username })
    } else {
        res.redirect('/')
    }
})

app.get('/profile', async (req, res, next) => {
    if (await sessionExists(req)) {
        res.render('Profile', { user: app.locals.username })
    } else {
        res.redirect('/')
    }
})

app.get('/signup', async (req, res, next) => {
    if (await sessionExists(req)) {
        res.redirect('/dashboard')
    } else {
        res.render('Signup', { name: 'John' })
    }
})

app.post('/signup', async (req, res, next) => {

    const { body } = req
    const { username, password } = body

    //sanity checks
    if (!username || !password[0] || !password[1]) {
        res.send(`Username or Password cannot be empty. <a href="/signup">Sign Up</a>`)
        return
    }
    if (password[0] !== password[1]) {
        res.send(`Password Mismatch. <a href="/signup">Sign Up</a>`)
        return
    }

    //CHECK USER DOES NOT EXIST
    //User.find() is asynchronous so use await

    let user;
    user = await User.findOne({username: req.body.username})
    if(user) {
        res.send(`User Exists. <a href="/signup">Sign Up</a>`)
        return //required to break the req-res cycle here
    }

    //CREATE USER
    const newUser = new User();
    newUser.username = req.body.username
    newUser.password = newUser.generateHash(password[0])
    await newUser.save()
    
    res.send(`Sign up successful. <a href="/">Sign In</a>`)
    
})


app.get('/logout', async (req, res, next) => {
    if (await sessionExists(req)) {
        await Session.deleteOne({ sid: req.cookies.sid })
        res.render('Logout', { name: 'John' })
    } else {
        res.redirect('/')
    }

})


app.post('/signin', async (req, res, next) => {

    const { body } = req
    const { username, password } = body

    //TODO: verify empty email/password on client side

    if (await sessionExists(req))  {
        res.redirect('/dashboard')
        return
    }

    
    //VERIFY LOGIN CREDENTIALS
    let user;
    user = await User.findOne({username: req.body.username})

    //TODO: perform username/password sanity on client side
    if(!req.body.password || !req.body.username){
        res.redirect('/')
        return
    }

    if(!user.isPasswordValid(req.body.password)){
        res.redirect('/')   //TODO: display message on signin page using javascript
        return              
    }

    //CREATE USER SESSION
    const newSession = new Session()
    newSession.username = req.body.username
    newSession.sid = uuidv4();
    await newSession.save()
    //TODO: make username in session unique, then purge any stale session before creating new one
    
    app.locals.username = req.body.username

    
    //SET COOKIE
    res.setHeader('Set-Cookie', [`sid=${newSession.sid}`])
    res.redirect('/dashboard')

})


//verify session
async function sessionExists(req) {
    let temp;
    
    temp = await Session.findOne({ sid: req.cookies.sid }) 
    return temp;
}

app.listen(process.env.PORT, () => console.log('running..'))