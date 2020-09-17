--------------------------------------
bibliotecas usadas
--------------------------------------
Criar o arquivo package
npm init

//Gerencia as requisições, rotas e URLs, entre outra funcionalidades
npm install express

//Instalar o módulo para reiniciar o servidor sempre que houver alteração no código fonte
npm install -D nodemon

//Rodar o projeto usando o nodemon 
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

template helpers : permite varios dados



//middleware exemplo de login
/* 
PROCESSO DE LOGIN
- Requisição
- Validar os campos
- Autorizar o usuario
 - Resposta (CONTROLLER)
 --Positiva
 --Negativa

*/

Sistema de cadastro de clientes em um blog,
para divulgação dos seus cursos.

Sistema de login
- email 
- senha
- esqueceu a senha

Sistema de cadastro
- nome
- email
- senha

Tela princiapal
- home

Adicionar post
- Imagem
- Titulo 
- Corpo
- tags


tags
- incluir de tags
- edição de tags

perfil
- editar perfil
 --- mudar nome
 --- e-mail


