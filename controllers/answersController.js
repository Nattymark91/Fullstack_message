const {Users, Answers} = require('../models/models');
const ApiError = require('../error/ApiError');

class AnswersController {
    async create(req, res, next) {
        try {
            let {email, answer} = req.body
            console.log(email +'  '+ answer)
            const person = await Users.findOne({where: {email}})
            const firstname = person.firstname
            const lastname = person.lastname
            const create_answer = await Answers.create({email, firstname, lastname, answer});
            if (answer=='да') {
                return res.status(200).json({message: "Ждем тебя на летнем корпоративе!"})
            }
            return res.status(200).json({message: "Очень жаль, что ты не сможешь приехать =("})
        } catch (e) {
            next(ApiError.badRequest(`К сожалению на сервере произошла ошибка. Пожалуйста, повторите позже.`))
        }
    }

    async getAll(req, res, next) {
        try {
            let {page, limit, order} = req.query
            page = +page || 1
            limit = +limit || 30
            let offset = page * limit - limit
            order = order  || 'ASC' 
            let answers = await Answers.findAndCountAll({order: [['createdAt', order]],limit, offset})
            return res.json(answers)
        } catch (e) {
            next(ApiError.badRequest(`Ошибка сервера.`))
        }     
    }   
}

module.exports = new AnswersController()