const React = require('react')
const BaseLayout = require('./BaseLayout')


function Home(props){
    return (
        <BaseLayout>
            <div className="container">
                <div className="nav">
                    <a href="/"><h1>Home</h1></a>
                    <ul>
                        <a href="/signup"><li>Sign Up</li></a>
                    </ul>
                </div>

                <div className="showcase"></div>

                <div className="signin">
                    <form action="/signin" method="post">
                        <p>Sign In</p>
                        <label htmlFor="username" style ={{display: 'block'}}>Username</label>
                        <input type="text" name="username" style ={{display: 'block'}}/>
                        <label htmlFor="password" className="password" style ={{display: 'block'}}>Password</label>
                        <input type="password" name="password" style ={{display: 'block'}} />
                        <br/>
                        <input type="submit" value="Sign In"/>
                    </form>
                </div>
                
            </div>
        </BaseLayout>
    )
}

module.exports = Home;