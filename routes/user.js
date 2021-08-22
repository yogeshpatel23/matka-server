const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        const user = await User.find({
            mobile: req.body.mobile
        }).exec()
        if (user.length > 0) {
            return res.status(409).json({
                message: 'Mobile number already register'
            })
        }
        const haspass = await bcrypt.hash(req.body.password, 10)
        const newUser = await User.create({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            mobile: req.body.mobile,
            password: haspass,
        })
        res.status(201).json(newUser)
    } catch {
        res.status(500).json({
            message: 'Somthing went wrong'
        })
    }

})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            mobile: req.body.mobile
        }).exec()
        if (!user) {
            return res.status(401).json({
                message: 'Mobile / Password incorrect'
            })
        }
        if (await bcrypt.compare(req.body.password, user.password)) {
            const data = {
                mobile: user.mobile,
                name: user.name,
                point: user.point,
                id: user._id
            }
            const accessToken = jwt.sign(data, process.env.JWT_TOKEN, )

            res.status(200).json({
                accessToken: accessToken
            })
        } else {
            res.status(401).json({
                message: 'Mobile / Password incorrect'
            })
        }

    } catch {
        res.status(500).json({
            message: 'Somthing went wrong'
        })
    }

})

module.exports = router