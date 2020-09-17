const mongoose = require('mongoose');
const slug = require('slug');
const Post = mongoose.model('Post');


exports.view = async (req, res) =>{
   const post = await Post.findOne({ slug:req.params.slug});
   res.render('view', { post });
}; 

exports.add = (req, res) =>{
    res.render('postAdd');
};  
 
exports.addAction = async(req, res) =>{
    //usando split para separar as tags depois de cada virgula
    //usando o trim para tirar o espaçamento do mongoDB
    req.body.tags = req.body.tags.split(',').map(t=>t.trim());
    
    req.body.author = req.user._id;
    const post = new Post(req.body); 


   try{
    await post.save(); //esperando a resposta
   }catch(error){
        req.flash('error', 'Erro, titulo não digitado, Tente novamente!');
        return res.redirect('/post/add');
        
   }
     

    req.flash('sucess', 'Post salvo com sucesso');
    res.redirect('/');
}; 

exports.edit = async (req, res) =>{
    //1.pegar as informações do post em questão
    const post = await Post.findOne({ slug:req.params.slug });
    //2. Carregar o formulario de edição
    res.render('postEdit', {post});
};

exports.editAction = async(req, res)=>{

    req.body.slug = slug(req.body.title, {lower:true});

  
    //usando split para separar as tags depois de cada virgula
    //usando o trim para tirar o espaçamento do mongoDB
  req.body.tags = req.body.tags.split(',').map(t=>t.trim());
  //1. procurar o item enviado
  try{
  const post = await Post.findOneAndUpdate(
      { slug:req.params.slug },
      req.body,
       {   
           new:true, //retornar novo item atualizado
           runValidators:true  //2. pegar os dados e atualizar
       }
  ); 
    }catch(error){
        req.flash('error', 'Erro,  Tente novamente!');
        return res.redirect('/post/'+req.params.slug+'/edit');
}   ;
         //3. mostrar mensagem de sucesso
       req.flash('sucess', 'Post atualizado com sucesso');

        //4. redirecionar para a home
       res.redirect('/');
 
  
    
};