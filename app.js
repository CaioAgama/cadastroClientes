//importa o express
const express = require('express');
//importando rotas
const router = require('./routes/index');
//importando interface 
const mustache = require('mustache-express');
//importando o helpers
const helpers = require('./helpers');
//importando pagina de erro
const erroHandler = require('./handlers/erroHandler');
//importando bibliotecas mensagens
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

//importando biblioteca para tratamento de login
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

 

//configuraçoes 
const app = express();

app.use(express.json()); //dados de requisiçoes
app.use(express.urlencoded({ extended:true }));

//colocar pasta public como static
app.use(express.static(__dirname + '/public'));

app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret:process.env.SECRET,
    resave:false, //se nao foi modificada nada, ele nao precisa construir nada
    saveUninitialized:false
}));

app.use(flash()); 

//configurando o model User /autenticação /registro
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{      
    res.locals.h = {...helpers};//clonar o objeto
    res.locals.flashes = req.flash(); // acesso automotica a todas as mensagens nos flashes
    res.locals.user = req.user; 

    
    if(req.isAuthenticated()){
            //filtro menu para guest(visitante) ou logged(logado)
            res.locals.h.menu = res.locals.h.menu.filter(i=>(i.logged));
    }else{
            //filtro menu para guest(visitante)
            res.locals.h.menu = res.locals.h.menu.filter(i=>i.guest);

    }
    next();
});


const User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 


app.use('/', router); //rotas


app.use(erroHandler.notFound);

app.engine('mst', mustache(__dirname+'/views/partials', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname + '/views'); //pegando a pasta views

module.exports = app; 

