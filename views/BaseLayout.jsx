const React = require('react');

function BaseLayout(props){
    return (
        <>
            <html>
                <head>
                    <meta charset="UTF-8"></meta>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <title>Home</title>
                    <link rel="stylesheet" href="/stylesheets/style.css" type="text/css"/>
                </head>
                <body>
                    {props.children}
                </body>
            </html>
        </>
    )
}

module.exports = BaseLayout;