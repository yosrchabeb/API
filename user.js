const express = require("express");
const app = express();
const pool = require("./database");
const port = 3000;
const bcrypt = require("bcrypt");
const path = require('path');
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const session = require('express-session');



app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true
}));

app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log("server up and running on PORT :", port);
}); 

const sendResetPasswordEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
          user: 'youssrchabeb@tbs.u-tunis.tn',
          pass: 'Yosrchabeb75++'
      }
  });
  const mailOptions = {
      from: 'youssrchabeb@tbs.u-tunis.tn',
      to: email,
      subject: 'Reset Password',
      text: `Please click on this link to reset your password: http://localhost:3000/reset-password?token=${token}`
  };
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log(error);
      } else {
          console.log(`Email sent: ${info.response}`);
      }
  });
}

//login
app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);


  // Check if the email and password are valid
  pool.query(
    "SELECT * FROM users WHERE Email=?",
    [email],
    (error, results) => {
      if (error) {
        return res.status(500).send({ error: "Error fetching user from database" });
      }
      if (results.length === 0) {
        return res.status(401).send({ error: "Invalid email" });
      }
      const validPassword = bcrypt.compareSync(password, results[0].Password);
      if (!validPassword) {
        console.log((password));
        return res.status(401).send({ error: "Invalid password" });
      } else {
        let role;
        if (email==="admin@tbs.u-tunis.tn") {
          role = 'admin';
          req.session.role = 'admin';
          const token = jwt.sign({user: email, role: role}, "secretkey", { expiresIn: "1200s" });  
        } else {
          role = 'user';
          req.session.role = 'user';
          const token = jwt.sign({user: email, role: role}, "secretkey", { expiresIn: "1200s" });
          res.json({
            token
        });  
        }
          
        
       }
     
    }
  );
});




app.post("/signup", (req, res) => {
  const {ID,name,fname,email,password} = req.body;
  console.log(req.body);

  if (!ID || !name || !fname || !email || !password) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  if (!isValidEmail(email))  {
    return res.status(401).send({ error: "email format has to be example@tbs.u-tunis.tn" });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);

  pool.query(
    "INSERT INTO users(User_ID, User_name, User_fname, Email, Password) VALUES(?,?,?,?,?)",
    [ID,name,fname,email,hashedPassword],
    (error,results) => {
      if (error) {
        console.error(error);
        return res.status(500).send({ error: "Error inserting user into database" });
      } else {
        
        res.status(200).send({Message: "Account created Succesfully"});

      }
    }
  );
 
});


app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  
  // Check if email exists in the database
  pool.query("SELECT * FROM users WHERE Email=?", [email], (error, results) => {
    if (error) {
      return res.status(500).send({ error: "Error fetching user from database" });
    }
    if (results.length === 0) {
      return res.status(401).send({ error: "Invalid email" });
    }
    // Generate a unique token and store it in the database with the expiration time
    const token = crypto.randomBytes(32).toString("hex");
    const expirationTime = (Date.now() + 3600000)/1000; // 1 hour
    pool.query("UPDATE users SET reset_token = ?, reset_token_expiration = ? WHERE Email = ?", [token, expirationTime, email], (error) => {
      if (error) {
        return res.status(500).send({ error: "Error updating user in database" });
      }
      // Send an email with a link to the password reset route
      sendResetPasswordEmail(email, token);
      return res.status(200).send({ message: "Password reset email sent" });
    });
  });
});

app.get("/reset-password", (req, res) => {
  const {token} = req.body;
  pool.query("SELECT * FROM users WHERE reset_token=?", [token], (error, results) => {
  if (error) {
  return res.status(500).send({ error: "Error fetching user from database" });
  }
  if (results.length === 0) {
  return res.status(401).send({ error: "Invalid token" });
  }
  const user = results[0];
  if (user.reset_token_expiration >  Date.now()/1000) {
    return res.status(200).send({ message: "Valid and not expired token" });
    }


 // return res.render("reset-password", { token });
  });
  });


  app.post("/reset-password", (req, res) => {
    const {token,newPassword} = req.body;
    
    // Check if the token is valid by looking it up in the database and checking if it's expired
    pool.query("SELECT * FROM users WHERE reset_token=?", [token], (error, results) => {
    if (error) {
        return res.status(500).send({ error: "Error fetching user from database" });
    }
    if (results.length === 0) {
        return res.status(401).send({ error: "Invalid token" });
    }
    const user = results[0];
    if (user.reset_token_expiration <  Date.now()/1000) {
        return res.status(401).send({ error: "Expired token" });
    }
    // hash the new password and store it in the database, replacing the old password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    updateUserPassword(hashedPassword, user.email, res);
    });
});

const updateUserPassword = (hashedPassword, email, res) => {
    pool.query("UPDATE users SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE email = ?", [hashedPassword, email], (error) => {
        if (error) {
            return res.status(500).send({ error: "Error updating user in database" });
        }
        return res.status(200).send({ message: "password updated successfully"});
    });
}


app.get("/exam_announcements", checkAuth, async (req, res) => {
  try {
      await jwt.verify(req.token, 'secretkey', async (err, authData) => {
          if(err){
              return res.status(401).json({error: "Unauthorized"});
          } 
          try {
              const allannouncements = await pool.query("SELECT * FROM announcements");
              res.json(allannouncements.rows);
          } catch(err) {
              console.error(err.message);
              return res.status(500).json({error: "Error fetching data from database"});
          } 
      });
  } catch (err) {
      console.error(err);
      return res.status(500).json({error: "Error while trying to authenticate"});
  }
});

function checkAuth(req, res, next){
  //get auth header value 
  const bearerHeader = req.headers['authorization'];
  //check if bearer is undefined 
  if (typeof bearerHeader !== 'undefined'){
      //split at the space
      const bearer = bearerHeader.split(' ');
      //get token from array 
      const bearerToken = bearer[1];
      // set the token
      req.token = bearerToken;
      // next middleware
      next(); 
  } else {
      return res.status(401).json({error: "Unauthorized"});
  }
}

function isValidEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@tbs\.u-tunis\.tn$/;
  return re.test(String(email).toLowerCase());
}