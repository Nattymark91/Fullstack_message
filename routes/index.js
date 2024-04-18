const Router = require('express')
const router = new Router()
const usersRouter = require('./usersRouter')
const answersRouter = require('./answersRouter')

router.use('/users', usersRouter)
router.use('/answers', answersRouter)

module.exports = router