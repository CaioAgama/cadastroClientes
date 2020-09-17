//importando o banco de dados (mogoose)
const mongoose  = require('mongoose');
const slug = require('slug');

mongoose.Promise = global.Promise;

const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema({
    photo:String, 
    title:{
        type:String,       
        trim:true, 
        required:'O post precisa de um cliente' 
    },  
    slug:String,
    body:{ 
        type:String,
        trim:true
        
    },  
    tags:[String],

    author:{
        type:ObjectId,
        ref:'User'
    }
  
}); 


postSchema.pre('save', async function(next){
    if(this.isModified('title')){
        this.slug = slug(this.title, {lower:true});



        const slugRegex = new RegExp(`^(${this.slug})((-[0-9]{1,}$)?)$`, 'i');
        const postsWithSlug = await this.constructor.find({slug:slugRegex});

        if(postsWithSlug.length > 0){
                this.slug = `${this.slug}-${postsWithSlug.length + 1}`;
        }
    }
    next();
});

postSchema.statics.getTagsList = function(){
    return this.aggregate([
        { $unwind: '$tags'},//separar as tags para não ter repertiçoes
        { $group: {_id:'$tags', count:{ $sum:1 } } },//adicionar tags
        { $sort: {count:-1}} //ordenando do maior para o maior(tags)
    ]);
}

postSchema.statics.findPosts = function(filters = {}){

    //novo metodo usado
    return this.find(filters).populate('author');

    //metodo usando anteriomente, encontrei um modo mais facil com (populate)
    /*return this.aggregate([
            {$match:filters},
            {$lookup:{
                from:'users',
                let:{'author':'$author'},     
                pipeline:[
                    {$match:{ $expr:{ $eq: [ '$$author', '$_id' ] } } },
                    {$limit:1}
                ], 
                as:'author'  
            }},  
            {$addFields:{
                'author':{$arrayElemAt: ['$author', 0]}
            }}
    ]);*/

}
module.exports = mongoose.model('Post', postSchema);





