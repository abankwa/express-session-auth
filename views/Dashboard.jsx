const React = require('react')
const BaseLayout = require('./BaseLayout')


function Dashboard(props){
    return (
        <BaseLayout>
            <div className="container">
                <div className="nav">
                    <h1>Dashboard</h1>
                    <ul>
                        <a href="/profile"><li>{props.user}'s Profile</li></a>
                        <a href="/logout"><li>Logout</li></a>
                    </ul>
                </div>

                <div className="showcase"></div>

                <div className="dashboard">
                    <p>Welcome <strong>{props.user}</strong> to your dashboard</p>
                </div>
            </div>
        </BaseLayout>
    )
}

module.exports = Dashboard;