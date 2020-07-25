const React = require('react')
const BaseLayout = require('./BaseLayout')

function Logout(props){
    return (
        <div className="container">
        <div className="nav">
            <h1>Logout</h1>
            <ul>
                <a href="/"><li>Home</li></a>
            </ul>
        </div>

        <div className="showcase"></div>

        <div className="dashboard">
            <p>Your session has expired</p>
            <a href="/">Login</a> or <a href="/signup">Sign Up</a>
        </div>

    </div>
    )
}

module.exports = Logout;