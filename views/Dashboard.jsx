const React = require('react')
const BaseLayout = require('./BaseLayout')


function Dashboard(props){
    return (
        <BaseLayout>
            <div className="container">
                <div className="nav">
                    <h1>Dashboard</h1>
                    <ul>
                        <li>Welcome xxx</li>
                        <a href="/details"><li>Details</li></a>
                        <a href="/logout_action"><li>Logout</li></a>
                    </ul>
                </div>

                <div className="showcase"></div>

                <div className="dashboard">
                    <p>Welcome to your dashboard</p>
                </div>
            </div>
        </BaseLayout>
    )
}

module.exports = Dashboard;