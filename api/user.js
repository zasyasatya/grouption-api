const express = require('express');
const router = express.Router();

//User Models
const User = require('../models/user');

//pass hash
const bcrypt = require('bcrypt');

//signup
router.post('/signup', (req, res) => {
    let {name, email, pass} = req.body;
    name = name.trim();
    email = email.trim();
    pass = pass.trim();

    if (name == "" || email == "" || pass == "") {
        res.json({
           status: 'failed' ,
           message: 'Please type all field to Sign Up your account'
        })
    }
    else if (!/^[a-zA-Z ]*$/.test(name)) {
        res.json( {
            status: 'failed',
            message: 'Please type your clear name using alphabet'
        })
    }
    else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json( {
            status: 'failed',
            message: 'Please type the correct email. exm: email@domain.com'
        })
    }

    else if (pass.length < 8) {
        res.json({
            status: 'failed',
            message: 'Your password is to sort. Please type your password at least 8 digit'
        })
    }
    else {
        //user exist?
        User.find({email}).then(result => {
            if(result.length) {
                res.json({
                    status: 'failed',
                    message: 'Your account doesnt exist. Please try another email for your account'
                })
            }
            else {
                //create new user

                const saltRounds = 10;
                bcrypt.hash(pass, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        pass: hashedPassword,
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: 'success',
                            message: 'Your account successful to created. Enjoy the service',
                            data: result,
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: 'failed',
                            message: 'Error while saving account. Please try again'
                        })
                    })
                })
                .catch(err => {
                    res.json({
                        status: 'failed',
                        message: 'error while hashing pass!'
                    })
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: 'failed',
                message: 'no user exists!'
            })
        })
    }
})


//signin
router.post('/signin', (req, res) => {
    let {email, pass} = req.body;
    email = email.trim();
    pass = pass.trim();

    if (email =="" || pass == "") {
        res.json({
            status: 'failed',
            message: 'Please type your username and password. Fill all to sign in'
        })
    }
    else {
        User.find({email}).then(data => {
            if(data) {
                //user exists
                const hashedPass = data[0].pass;
                bcrypt.compare(pass, hashedPass).then(result => {
                    if(result){
                        res.json({
                            status: 'success',
                            testing: data.name,
                            data: data
                        })
                    }
                    else {
                        res.json({
                            status: 'failed',
                            message: 'Your password is wrong. Please try again'
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        status: 'failed',
                        message: 'Your password is wrong. Please try again'
                    })
                })
            }
            else {
                res.json({
                    status: 'failed',
                    message: 'Your password is wrong. Please try again'
                })
            }
        })
        .catch(err => {
            res.json({
                status: 'failed',
                message: 'Your account doesnt exist. Please sign up for your account'
            })
        })
    }
})


router.get('/data', async (req, res) => {
    const user = await User.find();
    res.send(user);
})

module.exports = router;