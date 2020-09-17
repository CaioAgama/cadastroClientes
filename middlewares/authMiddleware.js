exports.isLogged = (req, res, next) =>{
    //verificar se usuario esta logado
    if(!req.isAuthenticated()){
        req.flash('error', 'Você não tem permissão para acessar esta página.');
        res.redirect('/users/login');
        return;
    }
    next();

};

exports.changePassword = (req, res) =>{
    //Confirmar se as senhas são as mesmas
    if(req.body.password != req.body['password-confirm']){
        req.flash('error', 'as senhas não são as mesmas.');
        res.redirect('/profile');
        return;
    }
    //Procurar o usuario e trocar a senha dele
    req.user.setPassword(req.body.password, async ()=>{
        await req.user.save();
        
        req.flash('sucess', 'Senha alterado com sucesso.');
        res.redirect('/');
    });
    //Redirecionar para a HOME
}

