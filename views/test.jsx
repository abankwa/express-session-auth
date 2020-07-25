const React = require('react');
const Test2 = require('./test2')

function Test(props){
    return (
        <html>
            <head>
                <title>test</title>
                <link rel="stylesheet" href="/stylesheets/style.css" type="text/css"></link>
            </head>
            <body>
                <h3>Hello {props.name}</h3>
                <Test2 a={props.name}/>
            </body>
            
        </html>


    )

}

module.exports = Test;