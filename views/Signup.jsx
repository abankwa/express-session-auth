const React = require('react')
const BaseLayout = require('./BaseLayout')


function Signup(props){
    return (
        <BaseLayout>
            <div className="container">
                <div className="nav">
                    <h1>Sign Up</h1>
                    <a href="/"><h3>Home</h3></a>
                </div>

                <div className="showcase"></div>

                <div className="signup">
                    <form action="/signup" method="post">
                        <p>Sign Up</p>
                        <label for="username" style={{display: 'block'}}>Username</label>
                        <input type="text" name="username" />
                        <label for="password" className="password" style={{display: 'block'}}>Password</label>
                        <input type="password" name="password" style={{display: 'block'}} />
                        <label for="password2" className="password" style={{display: 'block'}} >Re-Enter Password</label>
                        <input type="password" name="password" style={{display: 'block'}} />
                        <input type="submit" value="Sign Up" />
                    </form>
                </div>
                
            </div>
        </BaseLayout>
    )
}

module.exports = Signup;