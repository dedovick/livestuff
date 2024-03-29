var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/livestuff');

var userSchema = new mongoose.Schema({
	username: String,
	senha: String,
	email: String
}, { collection: 'usuarios' }
);
var categorySchema = new mongoose.Schema({
    nome: String,
    ordem: Number,
	icon: String,
	url: String
}, { collection: 'categorias' }
);

var subCategorySchema = new mongoose.Schema({
    nome: String,
    categoria: categorySchema
}, { collection: 'subcategorias' }
);

var channelSchema = new mongoose.Schema({
    nome: String,
	idYoutube: String,
	idFacebook: String,
	idVimeo: String,
	idTwitch: String,
	idInstagram: String,
	status: Number,
    categoria: categorySchema
}, { collection: 'canais' }
);

var eventSchema = new mongoose.Schema({
    titulo: String,
    canais: [channelSchema],
	dataHora: Date,
	categorias: [categorySchema],
	subcategorias: [subCategorySchema],
	largeimage: String,
	status: String,
	videoId: String,
	url: String
}, { collection: 'eventos' }
);
 
module.exports = { 
	Mongoose: mongoose, 
	Categoria: categorySchema,
	SubCategoria: subCategorySchema,
	Canal: channelSchema,
	Evento: eventSchema,
	Usuario: userSchema
}