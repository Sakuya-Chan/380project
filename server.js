const express = require('express');
const app = express();

//set
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))

//cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//session
const session = require('express-session');
const store = new session.MemoryStore();
app.use(session({
  secret: 'bruh',
  cookie: { maxAge: 60 * 60 * 24 * 1000 },
  saveUnintitalized: false,
  store: store
}));


//startup
//const routes = require("./router/routes")
console.log(require('./package.json'));

//db
//mongodb+srv://wow:123@pdb.nqz4gfq.mongodb.net/?retryWrites=true&w=majority
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://wow:123@pdb.nqz4gfq.mongodb.net/?retryWrites=true&w=majority')
const db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Database Connected");
});
//user
const userdata = require("./models/user")
const book = require("./models/book");
/* const { render } = require('ejs');
const { findById } = require('./models/user');
const e = require('express');
 */

/*========================================================================*/
//login
app.get('/login', (req, res) => {

  res.status(200).render('login', { warning: "" });



})
app.post('/login', async (req, res) => {

    const { uname, pass } = req.body;
    console.log(req.body);
    if (uname && pass) {
      if (req.session.auth) {
        res.redirect('/');

      } else {
        //check password
        //get password from db
        const item = await userdata.findOne({ userid: uname });


        try {
          console.log(item);


          if (pass === item.password) {

            req.session.auth = true;
            req.session.user = uname;
            res.redirect('/');

          } else {
            console.log(req.session);
            res.render('login', { warning: 'Wrong Userid or password' })
          }
        } catch (expection) { res.render('login', { warning: 'Wrong Userid or password' }) }
      }
    } else {
      console.log(req.session);
      res.render('login', { warning: 'Wrong Userid or password' })
    }

  });


/*========================================================================*/
//register
app.get('/reg', (req, res) => {

  res.status(200).render('reg', { warning: "" });
})
app.post('/reg', async (req, res) => {


    var item = {
      password: req.body.pass,
      userid: req.body.uname

    }
    try {
      var data = new userdata(item);
      await data.save();
    } catch (expection) {
      res.render('reg', { warning: 'Please check your input' })
    }


  });




/*========================================================================*/
//index
app.get('/', async (req, res) => {
  //console.log(store);
  //console.log(req.session);

  if (req.session.auth) {
    console.log("index req from " + req.session.user);
    //namae=req.session.user;
    //res.status(200).render('index',{title: namae});
    const doc = await book.find();
    //res.json(doc);
    //call index passing doc
    res.render('newindex', { doc: doc ,user:req.session.user});

  } else {
    res.redirect('login');
    }
});



/*========================================================================*/
//detail/edit/update
app.get('/edit:id', async (req, res) => {
  if (req.session.auth) {
    try {
      console.log("get edit page req from " + req.session.user);
      console.log(req.params)
      
     data =await book.findById(req.params.id)
      console.log(data)
      res.render('edit', { doc: data ,msg:""});
    } catch (expection) {
      //res.send('some thing went wrong, please try later')
      res.send(expection)
    }

  } else {
    res.redirect('login');
  }
});
/*========================================================================*/
//edit
app.post('/edit', async (req, res) => {
  if (req.session.auth) {
    try {
      console.log("edit req from "+ req.session.user);
      var item = req.body
      await book.findOneAndUpdate({ _id: req.body._id }, req.body);
      var item = await book.findById(req.body._id);
      await res.render('edit', {doc:item, msg: "Document updated!" });
    } catch (expection) { 
      console.log(expection)
      res.send("conflicted Id! please edit!") }
  } else { res.redirect('login') }
});


/*========================================================================*/
//logout
app.post('/logout', (req, res) => {
  console.log(req.session);
  req.session.auth = false;
  req.session.destroy();
  res.redirect('login');

});





/*========================================================================*/
//create
app.get('/create', async (req, res) => {
  if (req.session.auth) {
    try {
      console.log("create get req from " + req.session.user);
      res.render('create');
    } catch (expection) { res.send('some thing went wrong, please try again later') }

  } else { res.redirect('login') }
})
app.post('/create', async (req, res) => {
    if (req.session.auth) {
      try {
        console.log("create put req from " + req.session.user);
        var item = req.body
        var data = new book(item)
        await data.save()
        console.log("create put req from " + req.session.user+" Complete")
        res.redirect('/')
      } catch (expection) {
        console.log(expection);
        console.log(item)
        res.send(res.send("conflicted Id! please edit!")) }

    } else { res.redirect('login') }

  });

/*========================================================================*/
//delete 
app.get('/del:id',async (req,res)=>{
  console.log("Delete request from " + req.session.user)
  await book.deleteOne({_id:req.params.id})
  res.redirect("/")
})


/*========================================================================*/
//404
app.get('*', function (req, res) {
  res.status(404).send('page not found');
});
app.post('*', function (req, res) {
  res.status(404).send('page not found');
});

server = app.listen(process.env.PORT || 4200, () => {
  console.log(server.address().address, server.address().port)
});