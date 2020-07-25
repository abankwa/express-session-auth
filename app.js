const express = require('express');
const app = express();
const port = 3000;
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {v4: uuidv4} = require('uuid')


let users = [
    {username: 'james',password: 'jamespass'},
    {username: 'john',password: 'johnpass'},
    {username: 'matt',password: 'mattpass'}
]

let sessions = []

//parse request body for post,cookie
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());

app.get('/',(req,res,next) => {
    if(sessionExists(req)){
        res.redirect('/dashboard')
    }else {
        res.sendFile(__dirname + './public/home.html')
    }
})

app.get('/dashboard', (req,res,next) => {
    console.log(sessions)
    if(!sessionExists(req)){
        res.redirect('/')
    }else {
        res.sendFile(__dirname + './public/dashboard.html')
    }
})

app.get('/details', (req,res,next) => {
    if(!sessionExists(req)){
        res.redirect('/')
    }else {
        res.sendFile(__dirname + './public/detail.html')
    } 
})

app.get('/signup', (req,res,next) => {
    if(sessionExists(req)){
        res.redirect('/dashboard')
    }else {
        res.sendFile(__dirname + './public/signup.html')
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
        res.sendFile(__dirname + './public/home.html')
    }
    
})

app.get('/logout', (req,res,next) => {
    if(sessionExists(req)){
        res.redirect('/dashboard')
    }else {
        res.sendFile(__dirname + './public/logout.html')
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
    //console.log('output')
    //console.log(req.cookies)

    if(!isEmpty(req.cookies)){  //TODO: check specifically the session cooki
        console.log('cookie exists')
        let data = sessions.find(session => session.sid === req.cookies.sid)
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