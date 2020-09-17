--------------------------------------
bibliotecas usadas
-----------------------------------
nodemon app.js

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

--------------------------------------

npm install mustache-express
biblioteca de interface.


npm install cookie-parser express-session express-flash --save
importando biblioteca de mensagens flash

