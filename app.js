const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {v4: uuidv4} = require('uuid')


//Global Data
let users = [
    {username: 'james',password: 'jamespass'},
    {username: 'john',password: 'johnpass'},
    {username: 'matt',password: 'mattpass'}
]

let sessions = []


//Middleware
app.use(bodyParser.urlencoded({extended:false})) //parse request body
app.use(cookieParser());                        //parse cookie

//template engine
app.set('views',__dirname + '/views');
app.set('view engine', 'jsx')
app.engine('jsx',require('express-react-views').createEngine());


app.get('/test',(req,res,next) => {
    res.render('Logout',{name: 'John'})
})

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
    if(!sessionExists(req)){
        res.redirect('/')
    }else {
        
        res.render('Dashboard',{user: getUserSession(req).user})
    }
})

app.get('/profile', (req,res,next) => {
    if(!sessionExists(req)){
        res.redirect('/')
    }else {
        res.render('Profile',{user: getUserSession(req).user})
    } 
})

app.get('/signup', (req,res,next) => {
    if(sessionExists(req)){
        res.redirect('/dashboard')
    }else {
        res.render('Signup',{name: 'John'})
    } 
})

app.post('/signup_action', (req,res,next) => {
    const lookup = users.find(user => user.username === req.body.username) //TODO: check if user is already signed in say from another browser/computer
   if(lookup === undefined){ //user does not exist
       if(req.body.password[0] === req.body.password[1]){
           users = [...users,{username:req.body.username,password:req.body.password[0]}]
           console.log(users)
           res.send(`Sign up successful. <a href="/">Login</a>`)
       }else {
           res.send(`Password mismatch. <a href="/signup">Try again</a>`)
       }
   }else {
       res.send(`User Exists. <a href="/signup">Try again</a>`)
   }
})

app.get('/logout_action', (req,res,next) => {
    if(sessionExists(req)){
        sessions = sessions.map(session => session.sid !== req.cookies.sid) //remove user session
        res.redirect('/logout')
    }else {
        res.render('Home',{name: 'John'})
    }
    
})

app.get('/logout', (req,res,next) => {
    if(sessionExists(req)){
        res.redirect('/dashboard')
    }else {
        res.render('Logout',{name: 'John'})
    }
    
})

app.post('/login', (req,res,next) => {
    if(sessionExists(req)){
        res.redirect('/dashboard')
    }
    if(verifyLogin(req.body)){
        console.log('login success')
        const sessionId = uuidv4();
        sessions = [...sessions,{user: req.body.username, sid:sessionId}]
        res.setHeader('Set-Cookie',[`sid=${sessionId}`])
        res.redirect('/dashboard')
    }else {
        res.redirect('/')
        console.log('login failed')
    }
})


//verify login
function verifyLogin(userLogin){
    let lookup = users.find(user => user.username === userLogin.username && user.password === userLogin.password)
    return lookup !== undefined ? true : false 
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

function getUserSession(req){
    return sessions.find(session => session.sid === req.cookies.sid)
}


//check empty object
function isEmpty(obj){
    return Object.keys(obj).length === 0;
}

app.listen(port, () => console.log('running..'))