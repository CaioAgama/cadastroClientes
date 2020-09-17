const User = require('../models/User');
const crypto = require('crypto'); //biblioteca para gerar token
const mailHandler = require('../handlers/mailHandler');

//controle de login de usuario
exports.login = (req, res)=>{
    res.render('login'); 
};

exports.loginAction = (req, res) =>{
    const auth = User.authenticate();

    auth(req.body.email, req.body.password, (error, result) =>{
            if(!result){
                    req.flash('error', 'Seu e-mail e/ou senha estão incorretos!');
                    res.redirect('/users/login');
                    return;
            }
            req.login(result, () => {}); //efetivação do login

            req.flash('sucess', 'Login feito com sucesso!');
            res.redirect('/');
    });
};


//controle de cadastro de usuario 
exports.register =  (req, res)=>{  
    res.render('register'); 

};

exports.registerAction = (req, res) =>{
    const newUser = new User(req.body);
    User.register(newUser, req.body.password, (error)=>{
            if(error){
                req.flash('error', 'Ocorreu um erro, tente mais tarde');
                res.redirect('/users/register');
                return;

        }
        req.flash('sucess', 'Registro feito com sucesso, faça o login');
        res.redirect('/users/login');
    });
 
};
 
exports.logout = (req, res) =>{
    req.logout();
    res.redirect('/');
};

exports.profile = (req, res) =>{
    res.render('profile'); 
};

exports.profileAction = async(req, res) =>{
    try{ 
        const user = await User.findByIdAndUpdate(
            {_id:req.user._id},
            { name:req.body.name, email:req.body.email},
            { new:true, runValidators:true}

    );
    }catch(e){
        req.flash('error', 'Ocorreu algum erro:'+e.message);
        res.redirect('/profile');
        return;
}

        req.flash('sucess', 'Dados atualizados com sucesso');
        res.redirect('/profile');
};

exports.forget = (req, res) =>{
    res.render('forget');
};

exports.forgetAction = async (req, res) =>{
    //verificar se o usuario realmente existe
    const user = await User.findOne({email:req.body.email}).exec();
    if(!user){
        req.flash('error', 'Um e-mail foi enviado para você'); //mensagem para prevenção, privacidade
        res.redirect('/users/forget');
        return;
    }
      //gerar um token (com data de expiração)e salvar no banco
        user.resetPassswordToken = crypto.randomBytes(20).toString('hex'); //token com 20bits
        user.resetPassswordExpires = Date.now() + 3600000; // 1 horas
        await user.save(); //salvando no banco de dados

        const resetLink = `http://${req.headers.host}/users/reset/${user.resetPassswordToken}`;

        const to = `${user.name}<${user.email}>`;

        const html = `Testando e-mail com link: <a href="${resetLink}">Resetar sua Senha</a>`;
        const text = `Testando e-mail com link: ${resetLink}`;
        //TODO: enviar o e-email
        mailHandler.send({
            to,
            subject: 'Resetar sua senha',
            html,
            text
        });
  
        req.flash('sucess', 'Te enviamos um e-mail com instruções');
        res.redirect('/users/login');
};

exports.forgetToken = async(req, res) =>{
   const user = await User.findOne({
        resetPassswordToken: req.params.token,
        resetPassswordExpires: {$gt: Date.now()}
   }).exec();

   if(!user){
       req.flash('error', 'Token expirado');
       res.redirect('/users/forget');
       return;
   }
   res.render('forgetPassword');
};

exports.forgetTokenAction = async (req, res)=>{

     //verificar se o usuario realmente existe
     const user = await User.findOne({
        resetPassswordToken:req.params.token,
        resetPassswordExpires: {$gt: Date.now()}
     }).exec();
       
     if(!user){
         req.flash('error', 'Um e-mail foi enviado para você'); //mensagem para prevenção, privacidade
         res.redirect('/users/forget');
         return;
     }
     
      //Confirmar se as senhas são as mesmas
    if(req.body.password != req.body['password-confirm']){
        req.flash('error', 'as senhas não são as mesmas.');
        res.redirect('back');
        return;
    }


    //Procurar o usuario e trocar a senha dele
    user.setPassword(req.body.password, async ()=>{ 
        await user.save();
        
        req.flash('sucess', 'Senha alterado com sucesso.');
        res.redirect('/');
    });
   
 };
 
 