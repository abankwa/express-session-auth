const React = require('react')
const BaseLayout = require('./BaseLayout')


function Profile(props){
    return (
        <BaseLayout>
            <div className="container">
                <div className="nav">
                    <h1>{props.user}'s Profile</h1>
                    <ul>
                        <a href="/"><li>Home</li></a>
                        <a href="/logout_action"><li>Logout</li></a>
                    </ul>
                </div>

                <div className="showcase"></div>

                <div className="dashboard">
                    <p>Welcome to the details</p>
                </div>
            </div>
        </BaseLayout>
    )
}

module.exports = Profile;