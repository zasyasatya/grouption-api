require('./config/db');
const app = require('express')();
const port = process.env.PORT || 3000;
const UserRoute = require('./api/user');
bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/user', UserRoute);

app.listen(port, () => {
    console.log(`server running on port: ${port}`)
})