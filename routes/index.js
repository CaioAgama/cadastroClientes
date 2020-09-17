const express = require('express');
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const imageMiddleware = require('../middlewares/imageMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
router.get('/', homeController.index); 

//Rotas de Login de usuario
router.get('/users/login', userController.login); 
router.post('/users/login', userController.loginAction); 

//rotas de deslogar usuario
router.get('/users/logout', userController.logout); 


//Rotas de Cadastro de usuario
router.get('/users/register', userController.register);
router.post('/users/register', userController.registerAction);


//rotas esqueci a senha
router.get('/users/forget', userController.forget);
router.post('/users/forget', userController.forgetAction);

//rotas do token
router.get('/users/reset/:token', userController.forgetToken);
router.post('/users/reset/:token', userController.forgetTokenAction);
 
//rotas para acesso ao perfil do usuario 
router.get('/profile', authMiddleware.isLogged, userController.profile);
router.post('/profile', authMiddleware.isLogged, userController.profileAction);

//rotas para alteração de senha
router.post('/profile/password', authMiddleware.isLogged, authMiddleware.changePassword);

//rotas para adicionar post
router.get('/post/add', authMiddleware.isLogged, postController.add);
router.post('/post/add', 
    authMiddleware.isLogged,
    imageMiddleware.upload,
    imageMiddleware.resize, 
    postController.addAction
    );
 

//rotas para editar post
router.get('/post/:slug/edit', authMiddleware.isLogged, postController.edit);
router.post('/post/:slug/edit',
    authMiddleware.isLogged,
    imageMiddleware.upload,
    imageMiddleware.resize, 
    postController.editAction
    ); 

//rotas para visualização do post
router.get('/post/:slug', postController.view);

module.exports = router;                                 