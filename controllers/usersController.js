const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Users} = require('../models/models')

const generateJwt = (id, email, firstname, lastname) => {
    return jwt.sign(
        {id, email, firstname, lastname},
        process.env.SECRET_KEY,
        {expiresIn: '30m'}
    )
}

class UsersController {
    async registration(req, res, next) {
        try {
            const {email, firstname, lastname, password} = req.body
            if (!email || !password) {
                return next(ApiError.badRequest('Некорректный email или пароль'))
            }
            const candidate = await Users.findOne({where: {email}})
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await Users.create({email, firstname, lastname, password: hashPassword})
            const token = generateJwt(user.id, user.email, user.firstname, user.lastname)
            return res.json({token})
        } catch (error) {
            next(ApiError.internal('Ошибка сервера. Обратитесь к системному администратору. ERROR: ' + error))
        }
        
    }

    async login(req, res, next) {
            try {
                const {email, password} = req.body
            const user = await Users.findOne({where: {email}})
            if (!user) {
                return next(ApiError.badRequest('Некорректный email или пароль'))
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.badRequest('Некорректный email или пароль'))
            }
            const token = generateJwt(user.id, user.email, user.firstname, user.lastname)
            console.log(token)
            return res.json({token})
        } catch (error) {
            next(ApiError.internal('Ошибка сервера. Обратитесь к системному администратору. ERROR: ' + error))
        } 
    }

    async check(req, res, next) {
        const token = req.user
        return res.json({token})
    }
}

module.exports = new UsersController()