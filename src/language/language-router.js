const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      let gNW = await LanguageService.getNextWord(req.app.get('db'),req.language.head)
      // console.log('gNw', gNW)
      res.json({
        nextWord: gNW.original,
        wordCorrectCount: gNW.correct_count,
        wordIncorrectCount: gNW.incorrect_count,
        totalScore: gNW.total_score,
        wordDescription: gNW.description
      })
      next()
    }
    catch (error) {
      console.log(error)
    }
  })

languageRouter
  .post('/guess', async (req, res, next) => {
    // implement me
    res.send('implement me!')
  })


languageRouter
  .get('/test',async (req, res, next) => {
    const { guess } = req.body

    for(const field of [guess])
      if(!req.body[field])
        return res.status(400).json({
          error: `Missing`
        })
    try {
      const wordsList = await LanguageService.getLinkedList(
        req.app.get('db'),
        req.language.id,
      )
      console.log('wordsList', wordsList)

      res.json({
        wordsList
      })
      next()
    } catch (error) {
      next(error)
    }
  })

module.exports = languageRouter
