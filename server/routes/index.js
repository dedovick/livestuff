var express = require('express');
var moment = require('moment-timezone');
var router = express.Router();
var passport = require('passport');
var ObjectId = require('mongodb').ObjectID;
const bcrypt = require('bcryptjs');
 
const server_url = 'http://34.67.130.241:3000/';

const authMailer = {
  user: 'livestuff.app@gmail.com',
  pass: 'yjdsdigwwgvtzvsm'
}

/* GET home page. */
router.get('/', authenticationMiddleware(), function(req, res, next) {
	// res.render('login', {message: null});
	res.render('index', { title: 'LiveStuff Admin' });
});

function authenticationMiddleware () {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login?fail=true')
  }
}

var getCategorias = function(callback, filter){
   //Exclui categoria destaque
   var db = require("../db");
   var Categorias = db.Mongoose.model('categorias', db.Categoria, 'categorias');
   Categorias.find(filter).lean().exec(callback);
};

var getUsuarios = function(callback, filter){
   
   var db = require("../db");
   var Usuarios = db.Mongoose.model('usuarios', db.Usuario, 'usuarios');
   Usuarios.find(filter).lean().exec(function(err, docs){
		var result = [];
		docs.forEach(function(user){
			result.push({id: user._id, name: user.username});
		})
		callback(err, result);
	}
   );
};

var getCategoriasComEvento = function(callback, timezone){
   //Exclui categoria destaque
   if(!timezone){
      timezone = "America/Sao_Paulo";
   }
   var dateFilter = moment().tz(timezone);
   if(dateFilter.hours() <= 6){
   	dateFilter.subtract(1, 'days');
   }
   var filter = {};
   const today = new Date(dateFilter.startOf('day').format());
   filter.dataHora = {
   	$gte: today
   };
   var db = require("../db");
   var Categorias = db.Mongoose.model('categorias', db.Categoria, 'categorias');
   Categorias.find().lean().exec(function (e, docs) {
		var categorias = {};
		docs.forEach(function(categoria){
			categoria.cont = 0;
			categoria.title = categoria.nome;
			delete categoria.nome;
			categorias[categoria.url] = {categoria: categoria};
		});
		var Eventos = db.Mongoose.model('eventos', db.Evento, 'eventos');
		Eventos.find(filter).sort().lean().exec(function (e2, events) {
			events.forEach(function(ev){
				if(ev.categorias){
					ev.categorias.forEach(function(cat){
						if(categorias[cat.url]){
							categorias[cat.url].categoria.cont++;
						}
					});
				}
			});
			var result = [];
			for(var key in categorias){
				if(categorias[key].categoria.cont > 0){
					result.push(categorias[key].categoria);
				}
			}
			callback(e, result);
		});
   });
};

var getSubCategorias = function(callback, filter){
   filter = filter || {};
   var db = require("../db");
   var Categorias = db.Mongoose.model('subcategorias', db.SubCategoria, 'subcategorias');
   Categorias.find(filter).lean().exec(callback);
};

var getCanais = function(callback, filter, sort){
   sort = sort || {nome : 1};
   filter = filter || {};
   var db = require("../db");
   var Canais = db.Mongoose.model('canais', db.Canal, 'canais');
   Canais.find(filter).sort(sort).lean().exec(callback);
};

function isDestaque(categoria) { 
    return categoria.url === 'destaques';
}

var getEventos = function(callback, timezone, filter, sort){
	sort = sort || {dataHora : 1};
	filter = filter || {};
	if(!timezone){
		timezone = "America/Sao_Paulo";
	}
	var db = require("../db");
	var Eventos = db.Mongoose.model('eventos', db.Evento, 'eventos');
	Eventos.find(filter).sort(sort).lean().exec(function (e, docs) {
		var result = [];
		var resultTmp = {}, dataTemp;
		if(docs && docs.length > 0){
		docs.forEach(function(evento){
			resultTmp = {
				id: evento._id,
				artista: evento.canais[0].nome,
				type: evento.subcategorias[0].nome,
				largeimage: evento.largeimage,
				title: evento.titulo,
				videoId: evento.videoId,
				url: evento.url
			}
			resultTmp.isDestaque = evento.categorias.find(isDestaque) !== undefined;
			resultTmp.dataHoraUTC = evento.dataHora;
			dataTemp = moment(evento.dataHora).tz(timezone);
			resultTmp.dataHora = dataTemp.format();
			resultTmp.data = dataTemp.format('YYYY-MM-DD');
			resultTmp.hora = dataTemp.format('HH:mm');
			result.push(resultTmp);
		});
		}
		callback(e, result);
	});
	
};

router.get('/login', function(req, res){
  if(req.query.fail)
    res.render('login', { message: 'Usuário e/ou senha incorretos!' });
  else
    res.render('login', { message: null });
});
 
router.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login?fail=true' })
);

router.post('/logout', function(req, res, next){
  req.logOut();
  res.redirect('/login');
})

/* GET CategoryList page. */
router.get('/listaCategorias', authenticationMiddleware(), function(req, res) {
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
router.get('/categorias/cadastro', authenticationMiddleware(), function(req, res) {
	res.render('novaCategoria', { title: 'Cadastrar categoria' });
});

/* POST Adiciona categoria no banco */
router.post('/addCategoria', authenticationMiddleware(), function (req, res) {
 
    var db = require("../db");
    var nomeCategoria = req.body.nome;
    var ordemCategoria = req.body.ordem;
	var iconCategoria = req.body.icon;
	var urlCategoria = req.body.url;
 
    var Categorias = db.Mongoose.model('categorias', db.Categoria, 'categorias');
    var categoria = new Categorias({ nome: nomeCategoria, ordem: ordemCategoria, icon: iconCategoria, url: urlCategoria });
    categoria.save(function (err) {
        if (err) {
            console.log("Error! " + err.message);
            return err;
        }
        else {
            console.log("Post saved");
            res.redirect("listaCategorias");
        }
    });
});

/* GET CategoryList page. */
router.get('/listaSubcategorias', authenticationMiddleware(), function(req, res) {

   getSubCategorias(function (e, docs) {
         res.render('listaSubCategorias', { "listaSubCategorias": docs });
   });
});

/* GET AddSubCategory page. */
router.get('/subcategorias/cadastro', authenticationMiddleware(), function(req, res) {
   getCategorias(function (e, docs) {
		res.render('novaSubCategoria', { 
			title: 'Cadastrar subcategoria',
			listaCategorias: docs
		});
   });
	
});

router.get('/categories', function(req, res) {
	getCategoriasComEvento(function (e, docs) {
		res.json(docs);
		res.end();
	});
})


router.get('/subcategories', function(req, res) {
	getSubCategorias(function (e, docs) {
		res.json(docs);
		res.end();
	});
})

router.get('/subcategorias/:idCategoria', function(req, res) {
	getSubCategorias(function (e, docs) {
		res.json(docs);
		res.end();
	},{"categoria._id": req.params.idCategoria});
})

/* POST Adiciona categoria no banco */
router.post('/addSubCategoria', authenticationMiddleware(), function (req, res) {
 
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
            res.redirect("listaSubcategorias");
        }
    });
 
});

/* GET CategoryList page. */
router.get('/listaCanais', authenticationMiddleware(), function(req, res) {
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
router.get('/canais/cadastro', authenticationMiddleware(), function(req, res) {
   getCategorias(function (e, docs) {
		res.render('novoCanal', { 
			title: 'Cadastrar canal',
			listaCategorias: docs
		});
   });
	
});

/* POST Adiciona categoria no banco */
router.post('/addCanal', authenticationMiddleware(), function (req, res) {
 
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
	if(req.body.idInstagram){
		canalAdd.idInstagram = req.body.idInstagram;
	}
	if(req.body.idVimeo){
		canalAdd.idVimeo = req.body.idVimeo;
	}
	if(req.body.idTwitch){
		canalAdd.idTwitch = req.body.idTwitch;
	}
	var Canais = db.Mongoose.model('canais', db.Canal, 'canais');
    var canal = new Canais(canalAdd);
    canal.save(function (err) {
        if (err) {
            console.log("Error! " + err.message);
            return err;
        }
        else {
            console.log("Post saved");
            res.redirect("listaCanais");
        }
    });
 
});

/* GET CategoryList page. */
router.get('/listaEventos', authenticationMiddleware(), function(req, res) {
   getEventos(
      function (e, docs) {
         res.render('listaEventos', { "listaEventos": docs });
   }, undefined, undefined, {dataHora : -1});
});

// GET /events by idchannel
router.get('/channels/events/:idyoutube', (req, res) => {
	getEventos(function (e, docs) {
         res.json(docs);
		 res.end();
	},
	undefined,
	{"canais.idYoutube": req.params.idyoutube});
});

var filterFromToday = function(timezone){
	
	if(!timezone){
		timezone = "America/Sao_Paulo";
	}
	
	var filter = {};

	var dateFilter = moment().tz(timezone);
	if(dateFilter.hours() <= 6){
		dateFilter.subtract(1, 'days');
	}
	const today = new Date(dateFilter.startOf('day').format());
	filter.dataHora = {
		$gte: today
	};
	return filter;
}
// GET /events 
router.get('/events', (req, res) => {
	var timezone = req.query.tz;
	if(!timezone){
		timezone = "America/Sao_Paulo";
	}
	var category = req.query.cat;
	var filter = filterFromToday(timezone);
	if(category){
		filter["categorias.url"] = category;
	}
	
	getEventos(function (e, docs) {
        res.json(docs);
		res.end();
	},
	timezone, 
	filter);
});

// GET /events 
router.post('/eventsById', (req, res) => {


	var filter = filterFromToday(req.query.tz);
	var listaIds = req.body.listaIds;
	if(!listaIds || listaIds.length == 0){

		res.json([]);
		res.end();
	}
	else{
		
		filter["_id"] = listaIds.map(function(e){
			try{ 
                	   return ObjectId(e.toString());
			} catch(error){
			   return undefined; 
			}
            	});
	
		getEventos(function (e, docs) {
			 res.json(docs);
			 res.end();
		}, undefined, filter);
	}
});

// GET /events 
router.post('/search', (req, res) => {

	var timezone = req.body.tz;
	if(!timezone){
		timezone = "America/Sao_Paulo";
	}
	var filter = {};
	if(req.body.dtInicial){
		var dateStart = moment.tz(req.body.dtInicial, 'YYYY-MM-DD', true, timezone);

		var start = new Date(dateStart.startOf('day').format());
		filter.dataHora = {
			$gte: start
		};
	}
	if(req.body.dtFinal){
		var dateEnd = moment.tz(req.body.dtFinal, 'YYYY-MM-DD', true, timezone);

		var end = new Date(dateEnd.endOf('day').format());
		if(!filter.dataHora){
			filter.dataHora = {};
		}
		filter.dataHora.$lte = end;
	}
	var listaIds = req.body.listaIds;
	if(listaIds && listaIds.length > 0){

		filter["_id"] = listaIds.map(function(e){
			try{ 
                	   return ObjectId(e.toString());
			} catch(error){
			   return undefined; 
			}
		});
	}
		
	getEventos(function (e, docs) {
		 res.json(docs);
		 res.end();
	}, timezone, filter);
});

// GET /events by date
router.get('/events/:data', (req, res) => {
	var dataFiltro = req.params.data;
	var timezone = req.query.tz;
	if(!timezone){
		timezone = "America/Sao_Paulo";
	}
	var filter = {};
	var category = req.query.cat;
	if(category){
		filter["categorias.url"] = category;
	}
	
	var dateFilter = moment.tz(dataFiltro, 'YYYY-MM-DD', true, timezone);

	var start = new Date(dateFilter.startOf('day').format());
	dateFilter.add(1, 'days');
	var end = new Date(dateFilter.startOf('day').format());
	filter.dataHora = {
		$gte: start, 
		$lt: end
	};
	getEventos(function (e, docs) {
		res.json(docs);
		res.end();
	}, 
	timezone, 
	filter);
});

/* GET AddEvent page. */
router.get('/eventos/cadastro', authenticationMiddleware(), function(req, res) {
   getCategorias(function(e, categorias){
		getSubCategorias(function (e, subcategorias) {
			getCanais(function (err, canais){
				res.render('novoEvento', { 
					title: 'Cadastrar evento',
					listaSubCategorias: subcategorias,
					listaCanais: canais,
					listaCategorias: categorias,
					evento: { 
						isDestaque: false,
						canais: [],
						categorias: [],
						subcategorias: []
					}
				});
			});
		});
	});
	
});

router.post('/eventos/desativar/:idEvento', authenticationMiddleware(), function(req, res){
	var idEvento = req.params.idEvento;
	
});

router.get('/addDestaque/:idEvento', authenticationMiddleware(), function(req, res){
	var idEvento = req.params.idEvento;
	var db = require("../db");
	getCategorias(function(err, docs){
		if(docs.length > 0){
			const Evento = db.Mongoose.model('eventos', db.Evento, 'eventos');
			Evento.findOneAndUpdate( { _id: idEvento }, { $push: { "categorias": docs[0] } }, function(err, result){
				res.redirect("/listaEventos");
			} );
		}
		else{
			res.redirect("/listaEventos");
		}
	}, {"url": "destaques"});
});

router.get('/removeDestaque/:idEvento', authenticationMiddleware(), function(req, res){
	var idEvento = req.params.idEvento;
	var db = require("../db");
	const Evento = db.Mongoose.model('eventos', db.Evento, 'eventos');
	Evento.findOneAndUpdate( { _id: idEvento }, { $pull: { "categorias": {"url": "destaques"} } }, function(err, result){
		res.redirect("/listaEventos");
	} );
});

var findUser = function(id, callback){ 
	var db = require("../db");
	var Usuarios = db.Mongoose.model('usuarios', db.Usuario, 'usuarios');
	Usuarios.find(new ObjectId(id)).lean().exec(callback);
}

router.get('/user', authenticationMiddleware(), function(req, res, next) {
  var id = req.user._id;
  findUser(id, function(err, usr){
	res.render('editUser', { 
		title: 'Editar usuario',
		user: {
			id: id,
			username: usr[0].username,
			email: usr[0].email
		}
	});
  });
});

var updateUser = function(id, userEdit, callback){
	var db = require("../db");
	var Usuarios = db.Mongoose.model('usuarios', db.Usuario, 'usuarios');
	Usuarios.updateOne({"_id": id}, {$set: userEdit}, callback);
}

router.post('/editUser', authenticationMiddleware(), function(req, res, next) {
		var password = req.body.password;
		var id = req.body.userId;
		findUser(id, function(err, docs){
			var user = docs[0];
			bcrypt.compare(password, user.senha, (err, isValid) => {
				var newPassword = req.body.newPassword;
				var confirmPassword = req.body.confirmPassword;
				isValid = isValid && (newPassword === confirmPassword);
				if (err || !isValid) { 
					res.render('editUser', {
						user: {
							id: id,
							username: req.body.nome,
							email: req.body.email
						}
					});
				}
				var userEdit = {
					senha: bcrypt.hashSync(newPassword, 10),
					email: req.body.email
				};
				updateUser(id, userEdit, function(err, result){
					res.render('index', { title: 'LiveStuff Admin' });
				});
			});
		});
});

router.get('/editEvento/:idEvento', authenticationMiddleware(), function (req, res) {
	var idEvento = req.params.idEvento;
	var db = require("../db");
	getCategorias(function(e, categorias){
		getSubCategorias(function (e, subcategorias) {
			getCanais(function (err, canais){
				const Evento = db.Mongoose.model('eventos', db.Evento, 'eventos');
				Evento.findOne( { _id: idEvento }, function(err, result){
					result.formattedDate = moment.tz(result.dataHora, 'America/Sao_Paulo').format(moment.HTML5_FMT.DATETIME_LOCAL);
					result.isDestaque = result.categorias.find(isDestaque) !== undefined;
					res.render('novoEvento', { 
						title: 'Editar evento',
						listaSubCategorias: subcategorias,
						listaCanais: canais,
						listaCategorias: categorias,
						evento: result
					});
				});
			});
		});
	});
	
	
});

function preparaEvento(req) {
	    
	var canais = [];
	canais.push(JSON.parse(req.body.canal));
	var categorias = [];
	categorias.push(JSON.parse(req.body.categoria));
	if(req.body.destaque){
		categorias.push(JSON.parse(req.body.destaque));
	}
	var subcategorias = [];
	subcategorias.push(JSON.parse(req.body.subcategoria));;
	var eventoAdd = {
		titulo: req.body.nome,
		canais: canais,
		categorias: categorias,
		subcategorias: subcategorias,
		status: 0,
		dataHora: moment.tz(req.body.datetime, 'America/Sao_Paulo'),
		url: req.body.url,
		largeimage: req.body.largeImage,
		videoId: req.body.videoId
	};
	return eventoAdd;
}
router.post('/editEvento/:idEvento', authenticationMiddleware(), function (req, res) {
	var idEvento = req.params.idEvento;
	var db = require("../db");
	var eventoUpdate = preparaEvento(req);
	const Evento = db.Mongoose.model('eventos', db.Evento, 'eventos');
	Evento.findOneAndUpdate( { _id: idEvento }, { $set: eventoUpdate }, function(err, result){
		res.redirect("/listaEventos");
	} );
});
/* POST Adiciona categoria no banco */
router.post('/addEvento', authenticationMiddleware(), function (req, res) {
 
    var db = require("../db");
	var eventoAdd = preparaEvento(req);
	var Eventos = db.Mongoose.model('eventos', db.Evento, 'eventos');
    var evento = new Eventos(eventoAdd);
    evento.save(function (err) {
        if (err) {
            console.log("Error! " + err.message);
            return err;
        }
        else {
            console.log("Post saved");
            res.redirect("listaEventos");
        }
    });
	
 
});

router.get('/server', function(req, res) {
  res.json([{ 'serverUrl': server_url }]);
  res.end();
});

// POST /suggest
router.post('/suggest', (req, res) => {
	
  const nodemailer = require('nodemailer')
  const mailOutput = "<html>\n\
					<body>\n\
					<table>\n\
					<tr>\n\
					<td>Email: </td><td>" + (req.body.hasOwnProperty('email') ? req.body.email : "não fornecido") + "</td>\n\
					</tr>\n\
					<tr>\n\
					<td>Sugestão: </td>" + req.body.text + "<td></td>\n\
					</tr>\n\
					</table></body></html>";

  const mailOptions = {
	from: (req.body.hasOwnProperty('email') ? req.body.email : 'livestuff.app@gmail.com'), // sender address
	to: 'livestuff.app@gmail.com', // list of receivers
	subject: 'Sugestões App', // Subject line
	html: mailOutput // html body
  }

  const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: authMailer
  })

  transporter.sendMail(mailOptions, function (err, info) {
	if (err)
	  console.log(err)
	else
	  console.log(info);
  })

  res.end('Email sent')
})

module.exports = router;
