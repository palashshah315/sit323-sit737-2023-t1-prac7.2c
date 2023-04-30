const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculate-service' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

const app = express();

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up session
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));

// Set up Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Set up a local authentication strategy using Passport.js
passport.use(new LocalStrategy(
    function (username, password, done) {
        if (username === 'deakin' && password === 'deakin12345') {
            // Successful login
            return done(null, { username: 'deakin' });
        } else {
            // Failed login
            return done(null, false, { message: 'Incorrect username or password.' });
        }
    }
));

// Serialize and deserialize user object using Passport.js
passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    done(null, { username: username });
});

// Set up login route
app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
}));

// Set up logout route
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// Set up dashboard route
app.get('/dashboard', ensureAuthenticated, function (req, res) {
    res.send(`
  Welcome, ${req.user.username} you're authenticated and now you can use your calculator!
  <li>For addition of two numbers enter the URL "http://localhost:2000/addTwoNumbers?n1=number1&n2=number2"</li>
  <li>For Multiplication of two numbers enter the URL "http://localhost:2000/multiplyTwoNumbers?n1=number1&n2=number2"</li>
  <li>For Division of two numbers enter the URL "http://localhost:2000/divideTwoNumbers?n1=number1&n2=number2"</li>
  <li>For Subtraction of two numbers enter the URL "http://localhost:2000/subtractTwoNumbers?n1=number1&n2=number2"</li>
  `);
});



//check if user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

//addition of two numbers

app.get('/addTwoNumbers', ensureAuthenticated, function (req, res) {
    try {
        const n1 = parseFloat(req.query.n1);
        const n2 = parseFloat(req.query.n2);
        if (isNaN(n1)) {
            logger.error("n1 is incorrectly defined");
            throw new Error("n1 incorrectly defined");
        }
        if (isNaN(n2)) {
            logger.error("n2 is incorrectly defined");
            throw new Error("n2 incorrectly defined");
        }

        if (n1 === NaN || n2 === NaN) {
            console.log()
            throw new Error("Parsing Error");
        }
        logger.info('Parameters ' + n1 + ' and ' + n2 + ' received for addition');
        const result = additionOfTwoNumbers(n1, n2);
        res.status(200).json({ statuscocde: 200, data: result });
    } catch (error) {
        console.error(error)
        res.status(500).json({ statuscocde: 500, msg: error.toString() })
    }
});

function additionOfTwoNumbers(num1, num2) {
    return num1 + num2;
};

//multiplication of two numbers
app.get('/multiplyTwoNumbers', ensureAuthenticated, function (req, res) {
    try {
        const n1 = parseFloat(req.query.n1);
        const n2 = parseFloat(req.query.n2);
        if (isNaN(n1)) {
            logger.error("n1 is incorrectly defined");
            throw new Error("n1 incorrectly defined");
        }
        if (isNaN(n2)) {
            logger.error("n2 is incorrectly defined");
            throw new Error("n2 incorrectly defined");
        }

        if (n1 === NaN || n2 === NaN) {
            console.log()
            throw new Error("Parsing Error");
        }
        logger.info('Parameters ' + n1 + ' and ' + n2 + ' received for addition');
        const result = multiplicationOfTwoNumbers(n1, n2);
        res.status(200).json({ statuscocde: 200, data: result });
    } catch (error) {
        console.error(error)
        res.status(500).json({ statuscocde: 500, msg: error.toString() })
    }
});

function multiplicationOfTwoNumbers(num1, num2) {
    return num1 * num2;
};


//division of two numbers
app.get('/divideTwoNumbers', ensureAuthenticated, function (req, res) {
    try {
        const n1 = parseFloat(req.query.n1);
        const n2 = parseFloat(req.query.n2);
        if (isNaN(n1)) {
            logger.error("n1 is incorrectly defined");
            throw new Error("n1 incorrectly defined");
        }
        if (isNaN(n2)) {
            logger.error("n2 is incorrectly defined");
            throw new Error("n2 incorrectly defined");
        }

        if (n2 == 0) {
            logger.error("n2 is incorrectly defined ");
            throw new Error("n2 incorrectly defined");
        }

        if (n1 === NaN || n2 === NaN) {
            console.log()
            throw new Error("Parsing Error");
        }
        logger.info('Parameters ' + n1 + ' and ' + n2 + ' received for addition');
        const result = divisionOfTwoNumbers(n1, n2);
        res.status(200).json({ statuscocde: 200, data: result });
    } catch (error) {
        console.error(error)
        res.status(500).json({ statuscocde: 500, msg: error.toString() })
    }
});

function divisionOfTwoNumbers(num1, num2) {
    return num1 / num2;
};



//subtraction of two numbers
app.get('/subtractTwoNumbers', ensureAuthenticated, function (req, res) {
    try {
        const n1 = parseFloat(req.query.n1);
        const n2 = parseFloat(req.query.n2);
        if (isNaN(n1)) {
            logger.error("n1 is incorrectly defined");
            throw new Error("n1 incorrectly defined");
        }
        if (isNaN(n2)) {
            logger.error("n2 is incorrectly defined");
            throw new Error("n2 incorrectly defined");
        }

        if (n1 === NaN || n2 === NaN) {
            console.log()
            throw new Error("Parsing Error");
        }
        logger.info('Parameters ' + n1 + ' and ' + n2 + ' received for addition');
        const result = subtractionOfTwoNumbers(n1, n2);
        res.status(200).json({ statuscocde: 200, data: result });
    } catch (error) {
        console.error(error)
        res.status(500).json({ statuscocde: 500, msg: error.toString() })
    }
});

function subtractionOfTwoNumbers(num1, num2) {
    return num1 - num2;
};



// Set up homepage route
app.get('/', function (req, res) {
    res.send(`
    <form method="post" action="/login">
      <label>Username:</label><br>
      <input type="text" name="username"><br>
      <label>Password:</label><br>
      <input type="password" name="password"><br><br>
      <input type="submit" value="Log In">
    </form>
  `);
});

// Start server
app.listen(3000, function () {
    console.log('Server started on port 3000');
});