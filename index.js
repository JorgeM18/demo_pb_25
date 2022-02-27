const fs = require('fs/promises');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const auth = require('./middlewares/auth');
const env = require('./env.config');
const dbConfig = require('./db/config');
const apisRoutes = require('./routers/app.routers');

const PORT = env.PORT || 8080;

const app = express();

// Middlewares
app.use(express.static('./public'));
app.use(session({
  name: 'coder-session',
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: dbConfig.mongodb.connectTo('sessions')
  })
}));

// Template engines
app.set('views', './views');
app.set('view engine', 'ejs');

// Routes
app.use(apisRoutes);
app.get('/', async (req, res) => {
  const user = await req.session.user;
  if (user) {
    return res.redirect('/profile');
  }
  else {
    return res.sendFile(__dirname+'/public/login.html');
  }
  
});

app.get('/profile', auth, async (req, res) => {
  const user = req.session.user;
  res.render('profile', { sessionUser: user });
});

app.get('/logout', auth, async (req, res) => {
  try {
    await fs.writeFile('./data/users.json', JSON.stringify(users));
    req.session.destroy(err => {
      if (err) {
        console.log(err);
        res.clearCookie('my-session');
      }
      else {
        res.clearCookie('my-session');
        res.redirect('/');
      }
    })
  }
  catch(err) {
    console.log(err);
  }
});

app.get('/unauthorized', (req, res) => {
  res.status(401).sendFile(__dirname+'/public/unauthorized.html');
});

app.get('/notenoughfunds', auth, (req, res) => {
  res.status(400).sendFile(__dirname+'/public/notenough.html');
});

app.get('/error', (req, res) => {
  res.status(500).sendFile(__dirname+'/public/error.html');
});

app.post('/login', async (req, res) => {

  const { email, password } = req.body;
  const user = users.find(user => user.email === email);
  if (!user) return res.redirect('/error');
  req.session.user = user;
  res.redirect('/profile');
});

app.post('/transfer', auth, (req, res) => {
  const {  receiverAccount, senderAccount, amount, } = req.body;
  const sessionUser = req.session.user;

  const userAccount = sessionUser.accounts.find(account => account.number === senderAccount);
  if (+amount > userAccount.balance || userAccount.delinquent) return res.redirect('/notenoughfunds');

  const receiver = users.find(user => user.accounts.some(account => account.number === receiverAccount));
  if (!receiver) return res.redirect('/error');
  
  const targetAccount = receiver.accounts.find(account => account.number === receiverAccount);
  
  targetAccount.balance += +amount;
  userAccount.balance -= +amount;

  receiver.balance += +amount;
  res.sendFile(__dirname + '/public/success.html');
});

app.listen(PORT, async () => {
  console.log('Server is up and running on port: ', +PORT);
});