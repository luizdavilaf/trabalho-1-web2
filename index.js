const express = require('express');
const app = express();
const session = require('express-session');
const sync = require('./src/models/sync')
const logger = require('./src/middlewares/logger');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');



app.use(express.static('public'));

app.use(session({
    secret: 'SEGREDO DA APLICACAO, SE VAZAR DA RUIM',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 } 
}));
app.use(flash());
app.use(logger);
app.set('view engine', 'ejs');  
app.set('views', 'src/views');  
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());



const userRoutes = require('./src/routes/user-routes');
app.use('/users', userRoutes);

const postRoutes = require('./src/routes/post-routes');
app.use('/posts', postRoutes);

const homeRoutes = require('./src/routes/home-routes');
app.use('/', homeRoutes);


app.listen(3000, () => {
    console.log("SERVER STARTED AT 3000");
});