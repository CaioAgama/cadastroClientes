//importando bibliotecas para trabalhar com as imagens
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions ={
    storage:multer.memoryStorage(), //salvando imagem na memoria
    fileFilter:(req, file, next)=>{ //defini o formato da imagem
            const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
                if(allowed.includes(file.mimetype)){
                    next(null, true);
                }else{
                    req.flash('error', 'Tipo de arquivo não suportado');
            next(null, false);
        }
    }
};
exports.upload = multer(multerOptions).single('photo');//fazendo upload da imagem

exports.resize = async(req, res, next) =>{

    if(!req.file) {
        next();
        return;
    }

    const ext = req.file.mimetype.split('/')[1];
    let filename = `${uuid.v4()}.${ext}`;
    req.body.photo = filename;

    const photo = await jimp.read(req.file.buffer);
    await photo.resize(600, jimp.AUTO);
    await photo.write(`./public/media/${filename}`);
    next();
}; 