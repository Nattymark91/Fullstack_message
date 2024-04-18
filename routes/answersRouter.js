const Router = require('express')
const router = new Router()
const answersController = require('../controllers/answersController')

router.post('/',  answersController.create)
router.get('/', answersController.getAll)

module.exports = router