const express = require('express')
const app = express();  

const router = express.Router();
const handlebars = require('express-handlebars');
const bodyparse = require('body-parser')
const Sequelize = require('sequelize');

const mongoose = require('mongoose');
const res = require('express/lib/response');
const { redirect, render } = require('express/lib/response');


const session = require('express-session')
const flash = require('connect-flash');
const { lazyrouter } = require('express/lib/application');
var  logis =  ""
var das =''
var nomeCli =''
var dados ="";
var lopListComentario = []






app.use(session({
    secret:"inicio",
    reseve:true,
    saveUninitialized:true
}))





app.use(flash());

app.use((req, res, next)=>{
    res.locals.certo_msg = req.flash('certo_msg')
    res.locals.erro_msg = req.flash("erro_msg")
    next()

})


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/TOKIO_BANCO').then(()=>{
    console.log('conexao bem estabelecida')
}).catch((erro)=>{
    console.log('erro na conexao com banco ' , erro)
})

// const Categorias = mongoose.model('categorias')


const UserSchema = mongoose.Schema;
const Comentar = new UserSchema({
    comentario:{type:String},
    clientNome:{type: String},
    data:{type:Date, default: Date}
})

mongoose.model('bancoTokio', Comentar);
const newUser = mongoose.model('bancoTokio');



const UserCliente = mongoose.Schema;
const Cliente = new UserCliente({
    nome:{type:String},
    email:{type:String, required : true, 
        unique:true,
        lowercase:true},
    senha:{type:String},
    data:{type:Date, default: new Date()}
})


mongoose.model('new_banco_tokio_cliente_new', Cliente);
const newCliente = mongoose.model('new_banco_tokio_cliente_new');


const perm = handlebars.create({defaultLayout:'main',runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
},
})

app.engine('handlebars',perm.engine);
// app.use('/img', express.static(__dirname + '/img'));
app.use('/', express.static(__dirname + '/'));



app.set('view engine', 'handlebars');

app.use(express.urlencoded({extends:false}));
app.use(express.json());


app.get('/tokio',function(req, res){

              
    
    const teste = req.session.login

    if(teste == null||teste == "" || teste == undefined){
        newUser.find().sort({data:'desc'}).then((comenta )=>{

        res.render('tokiomarine', {comenta})
        })
    }else{
    newCliente.find({email:teste.email, senha:teste.senha}, (err, cliente)=>{
        newUser.find().sort({data:'desc'}).then((comenta )=>{
        
           

            res.render('tokiomarine' , {cliente,comenta})
        })
})
}


})


app.post('/cliente', function(req, res){
        das = req.body;

    new newCliente({
        nome:das.nomes,
        email:das.emails,
        senha:das.senhas

    }).save().then(()=>{
       dados = newCliente.findOne({email:das.emails}, (err, test)=>{
            req.session.testando = test;
            req.session.

        req.flash('certo_msg', 'Conta criada com sucesso')
        res.redirect('/logar')
        })
}).catch((erro)=>{
    req.flash('erro_msg', 'Erro ao criar conta')
    res.redirect('/cadastrar')
})
})





app.post('/tokio', function(req, res){
     const dass =req.body
     const teste = req.session.login
    //  req.session.sair

    
    if(dass.come  == "" || dass.come == null || dass.come == undefined){
        
        // const elementClasses = dass.come.classList;

        // elementClasses.classList.add("erro");
        req.flash('erro_msg', "Comentario invalido")
        res.redirect("/tokio" )
    }else if(teste ==""|| teste == null || teste == undefined){
        req.flash('erro_msg', "Faça login antes de comentar")
        res.redirect("/logar" )
    }else{
    new newUser({
        comentario:dass.come,
        clientNome:nomeCli.nome
    }).save().then(()=>{
        
             
                    req.flash('certo_msg', "Comentario adicionado" )
                    res.redirect("/tokio")


           
    }).catch((erro)=>{
        console.log('Deu erro no salvamento dos dados ', erro)
        
    })
    }

})



app.get('/cadastrar',async  function(req, res){
  
    
         res.render('formulario_login')
   
    
});




app.post('/logar', async (req, res)=>{
    logis = req.body



    
      
        if(logis.emailsLog == "" || logis.emailsLog == null || logis.emailsLog == undefined|| logis.senhasLog == "" || logis.senhasLog == null || logis.senhasLog == undefined){
            
            req.flash('erro_msg', "Erro nos peenchimento dos campos")
            res.redirect("/logar")


        }else{
            newCliente.find({email:logis.emailsLog, senha:logis.senhasLog}, (err, cliente)=>{
               newUser.find().sort({data:'desc'}).then(()=>{

                if(cliente[0].email == logis.emailsLog && cliente[0].senha == logis.senhasLog){
                    
                
                    nomeCli = cliente[0]
                    req.session.login = nomeCli
                    
                        req.flash('certo_msg', "Login efetuado com sucesso")
                        res.redirect('/tokio')
                    
        }
    } ).catch((erro)=>{
        req.flash("erro_msg", "Usuario não existe")
        res.redirect('/logar')


    })
    })
}
          
})





app.get('/logar', (req, res)=>{
    const newTeste = req.session.testando
        res.render('_login', {cliente:newTeste})
           
            
})



app.get('/',  function(req, res){
    req.session.destroy();
    res.redirect('/tokio')
       })
   

 

    
app.get('/area_cliente', async (req, res)=>{
    
    newCliente.findOne({email:logis.emailsLog},(err,dados_cli)=>{
      newUser.find({clientNome:nomeCli.nome}).sort({data:"desc"}).then((todosCome)=>{
          
  
        
        res.render('area_client',{dados_cli,todosCome})
    })
     
                        
        }) 
          
        
})





app.listen(1000 ,function(){
    console.log('Servidor rodanda na url http://localhost:1000');
});

// module.exports = router;
// })

// app.get('/cliente', function(req, res){
//     newCliente.findOne().sort({data:'desc'}).then((cliente)=>{
//         newUser.find().sort({data:'desc'}).then((comenta)=>{
//             res.render('tokiomarine', {cliente,comenta})

//         })
//     })
  

// })
