var express = require('express');
var router = express.Router();
const server_url = 'https://live-stuff-server.herokuapp.com/'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LiveStuff Admin' });
});

var getCategorias = function(callback){
   var db = require("../db");
   var Categorias = db.Mongoose.model('categorias', db.Categoria, 'categorias');
   Categorias.find({}).lean().exec(callback);
};

var getSubCategorias = function(callback, filter){
   filter = filter || {};
   var db = require("../db");
   var Categorias = db.Mongoose.model('subcategorias', db.SubCategoria, 'subcategorias');
   Categorias.find(filter).lean().exec(callback);
};

var getCanais = function(callback){
   var db = require("../db");
   var Canais = db.Mongoose.model('canais', db.Canal, 'canais');
   Canais.find({}).lean().exec(callback);
};

var getEventos = function(callback, filter){
	filter = filter || {};
	var db = require("../db");
	var Eventos = db.Mongoose.model('eventos', db.Evento, 'eventos');
	Eventos.find(filter).lean().exec(callback);
};

/* GET CategoryList page. */
router.get('/listaCategorias', function(req, res) {
   getCategorias(function (e, docs) {
         res.render('listaCategorias', { "listaCategorias": docs });
   });
});

router.get('/categorias', function(req, res) {
	getCategorias(function (e, docs) {
		res.json(docs);
		res.end();
	});
});

/* GET AddCategory page. */
router.get('/categorias/cadastro', function(req, res) {
	res.render('novaCategoria', { title: 'Cadastrar categoria' });
});

/* POST Adiciona categoria no banco */
router.post('/addCategoria', function (req, res) {
 
    var db = require("../db");
    var nomeCategoria = req.body.nome;
    var ordemCategoria = req.body.ordem;
	var iconCategoria = req.body.imageIcon;
 
    var Categorias = db.Mongoose.model('categorias', db.Categoria, 'categorias');
    var categoria = new Categorias({ nome: nomeCategoria, ordem: ordemCategoria, imageIcon: iconCategoria });
    categoria.save(function (err) {
        if (err) {
            console.log("Error! " + err.message);
            return err;
        }
        else {
            console.log("Post saved");
            res.redirect("categorias");
        }
    });
});

/* GET CategoryList page. */
router.get('/listaSubcategorias', function(req, res) {

   getSubCategorias(function (e, docs) {
         res.render('listaSubCategorias', { "listaSubCategorias": docs });
   });
});

/* GET AddSubCategory page. */
router.get('/subcategorias/cadastro', function(req, res) {
   getCategorias(function (e, docs) {
		res.render('novaSubCategoria', { 
			title: 'Cadastrar subcategoria',
			listaCategorias: docs
		});
   });
	
});

router.get('/categories', function(req, res) {
	getSubCategorias(function (e, docs) {
		res.json(docs);
		res.end();
	},{"categoria.nome": "Música"});
})


router.get('/subcategorias/:idCategoria', function(req, res) {
	getSubCategorias(function (e, docs) {
		res.json(docs);
		res.end();
	},{"categoria._id": req.params.idCategoria});
})

/* POST Adiciona categoria no banco */
router.post('/addSubCategoria', function (req, res) {
 
    var db = require("../db");
    var nomeSubCategoria = req.body.nome;
    var categoria = JSON.parse(req.body.categoria);
	var SubCategorias = db.Mongoose.model('subcategorias', db.SubCategoria, 'subcategorias');
    var subcategoria = new SubCategorias({ nome: nomeSubCategoria, categoria: categoria });
    subcategoria.save(function (err) {
        if (err) {
            console.log("Error! " + err.message);
            return err;
        }
        else {
            console.log("Post saved");
            res.redirect("subcategorias");
        }
    });
 
});

/* GET CategoryList page. */
router.get('/listaCanais', function(req, res) {
   getCanais(
      function (e, docs) {
         res.render('listaCanais', { "listaCanais": docs });
   });
});

// GET /channels
router.get('/channels', (req, res) => {
	getCanais(
      function (e, docs) {
         res.json(docs);
		 res.end();
   });
})

/* GET AddChannel page. */
router.get('/canais/cadastro', function(req, res) {
   getCategorias(function (e, docs) {
		res.render('novoCanal', { 
			title: 'Cadastrar canal',
			listaCategorias: docs
		});
   });
	
});

/* POST Adiciona categoria no banco */
router.post('/addCanal', function (req, res) {
 
    var db = require("../db");
	var canalAdd = {
		nome: req.body.nome,
		categoria: JSON.parse(req.body.categoria),
		status: 0
	};
    if(req.body.idYoutube){
		canalAdd.idYoutube = req.body.idYoutube;
	}
	if(req.body.idFacebook){
		canalAdd.idFacebook = req.body.idFacebook;
	}
	if(req.body.idVimeo){
		canalAdd.idVimeo = req.body.idVimeo;
	}
	if(req.body.idTwitch){
		canalAdd.idTwitch = req.body.idTwitch;
	}
	console.log(canalAdd);
	var Canais = db.Mongoose.model('canais', db.Canal, 'canais');
    var canal = new Canais(canalAdd);
    canal.save(function (err) {
        if (err) {
            console.log("Error! " + err.message);
            return err;
        }
        else {
            console.log("Post saved");
            res.redirect("canais");
        }
    });
 
});

/* GET CategoryList page. */
router.get('/listaEventos', function(req, res) {
   getEventos(
      function (e, docs) {
         res.render('listaEventos', { "listaEventos": docs });
   });
});

// GET /events by idchannel
router.get('/channels/events/:idyoutube', (req, res) => {
	getEventos(function (e, docs) {
         res.json(docs);
		 res.end();
	}, {"canais.idYoutube": req.params.idyoutube});
});

// GET /events 
router.get('/events', (req, res) => {
	const today = new Date();
	const year = today.getUTCFullYear();
	const month = today.getUTCMonth();
	var date = today.getUTCDate();
	//Vira a data de consulta às 6:00 UTC (3:00 BRT)
	if(today.getUTCHours() <= 6){
	  date -= 1;
	}

	var dateFilter = new Date(Date.UTC(year, month, date));
	getEventos(function (e, docs) {
         res.json(docs);
		 res.end();
	}, {dataHora: {$gte: dateFilter}});
});

// GET /events 
router.post('/eventsById', (req, res) => {
	getEventos(function (e, docs) {
         res.json(docs);
		 res.end();
	}, { _id: req.body.listaIds});
});

// GET /events by date
router.get('/events/:data', (req, res) => {
	var dataFiltro = req.params.data;
	
	var ano = parseInt(dataFiltro.substring(0,4));
	var mes = parseInt(dataFiltro.substring(5,7)) - 1;
	var dia = parseInt(dataFiltro.substring(8,10));

	var start = new Date(Date.UTC(ano, mes, dia));
	
	var end = new Date(Date.UTC(ano, mes, dia));
	end.setUTCHours(23,59,59,999);
	    
	getEventos(function (e, docs) {
		res.json(docs);
		res.end();
	}, {dataHora: {$gte: start, $lt: end}});
});

/* GET AddEvent page. */
router.get('/eventos/cadastro', function(req, res) {
   getSubCategorias(function (e, subcategorias) {
		getCanais(function (err, canais){
			res.render('novoEvento', { 
				title: 'Cadastrar evento',
				listaSubCategorias: subcategorias,
				listaCanais: canais
			});
		});
   });
	
});

/* POST Adiciona categoria no banco */
router.post('/addEvento', function (req, res) {
 
    var db = require("../db");
	var canais = [];
	canais.push(JSON.parse(req.body.canal));
	var subcategorias = [];
	subcategorias.push(JSON.parse(req.body.subcategoria));
	var eventoAdd = {
		titulo: req.body.nome,
		canais: canais,
		subcategorias: subcategorias,
		status: 0,
		dataHora: req.body.datetime
	};
    
	var Eventos = db.Mongoose.model('eventos', db.Evento, 'eventos');
    var evento = new Eventos(eventoAdd);
    evento.save(function (err) {
        if (err) {
            console.log("Error! " + err.message);
            return err;
        }
        else {
            console.log("Post saved");
            res.redirect("eventos");
        }
    });
	
 
});

router.get('/server', function(req, res) {
  res.json([{ 'serverUrl': server_url }]);
  res.end();
});

module.exports = router;
