const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {v4: uuidv4} = require('uuid')
const Session = require('./models/Sessions')


//Global Data //TODO: Replace with DB
let users = [
    {username: 'james',password: 'jamespass'},
    {username: 'john',password: 'johnpass'},
    {username: 'matt',password: 'mattpass'}
]

let sessions = []


//Middleware
app.use(bodyParser.urlencoded({extended:false})) //parse form data body
//app.use(bodyParser.json())                    //parse json body
app.use(cookieParser());                        //parse cookie

//template engine
app.set('views',__dirname + '/views');
app.set('view engine', 'jsx')
app.engine('jsx',require('express-react-views').createEngine());


//Serve Static Files
app.use(express.static('public'))



app.get('/',(req,res,next) => {
    if(sessionExists(req)){
        res.redirect('/dashboard')
    }else {
        res.render('Home',{name: 'John'})
    }
})

app.get('/dashboard', (req,res,next) => {
    if(sessionExists(req)){
        res.render('Dashboard',{user: getUserSession(req).user})
    }else {
        res.redirect('/')  
    }
})

app.get('/profile', (req,res,next) => {
    if(sessionExists(req)){
        res.render('Profile',{user: getUserSession(req).user})
    }else {
        res.redirect('/')
    } 
})

app.get('/signup', (req,res,next) => {
    if(sessionExists(req)){
        res.redirect('/dashboard')
    }else {
        res.render('Signup',{name: 'John'})
    } 
})

app.post('/signup', (req,res,next) => {
    const lookup = users.find(user => user.username === req.body.username)
   if(lookup === undefined){ //user does not exist
       if(req.body.password[0] === req.body.password[1]){
           users = [...users,{username:req.body.username,password:req.body.password[0]}]
           res.send(`Sign up successful. <a href="/">Login</a>`)
       }else {
           res.send(`Password mismatch. <a href="/signup">Try again</a>`)
       }
   }else {
       res.send(`User Exists. <a href="/signup">Try again</a>`)
   }
})


app.get('/logout', (req,res,next) => {
    if(sessionExists(req)){
        sessions = sessions.map(session => session.sid !== req.cookies.sid) //remove user session
        res.render('Logout', {name: 'John'})
    }else {
        res.redirect('/')
    }  
})


app.post('/login', (req,res,next) => {
    if(sessionExists(req)){
        res.redirect('/dashboard')
    }
    if(verifyLogin(req.body)){
        
        //create session
        const session = createAndSaveSession(req)

        //set cookie and headers
        res.setHeader('Set-Cookie',[`sid=${session.sid}`])
        res.redirect('/dashboard')
    }else {
        res.redirect('/')
    }
})

//verify login
function verifyLogin(userLogin){ 
    return users.some(user => user.username === userLogin.username && user.password === userLogin.password)   
}

//create session
function createAndSaveSession(req){
    const session = {user: req.body.username, sid: uuidv4()}
    sessions = [...sessions,session]
    return session
}

//get session
function getUserSession(req){
    return sessions.find(session => session.sid === req.cookies.sid)
}

//verify session
function sessionExists(req){
    if(!isEmpty(req.cookies)){  //TODO: check specifically the session cooki
        console.log('cookie exists')
        let data = getUserSession(req)
        return data !== undefined
    }else{
        return false
    }
}


//check empty object
function isEmpty(obj){
    return Object.keys(obj).length === 0;
}

app.listen(port, () => console.log('running..'))