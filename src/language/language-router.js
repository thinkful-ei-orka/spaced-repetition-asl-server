const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()
const jsonBodyParser = express.json()

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
      let gNW = await LanguageService.getNextWord(req.app.get('db'), req.language.head)
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
  .post('/test', jsonBodyParser, async (req, res, next) => {
    const { guess } = req.body
    console.log('gues', guess)

    for(const field of ['guess'])
      if(!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    try {
      const wordsList = await LanguageService.getLinkedList(
        req.app.get('db'),
        req.language.id,
        req.language.head
      )
      // console.log('wordsList', wordsList)

      const { isCorrect, previousId, list, word, head } = await LanguageService.wordGuesser(wordsList, guess)
      console.log('head in post req', head)
      // console.log('word from guessWorder', word)
      // console.log('previousId', previousId)
      // console.log(`word.value.id`, word.value.id)
      await LanguageService.updateWordNext(req.app.get('db'), previousId, word.value.id)
      await LanguageService.updateWord(req.app.get('db'), word.value.id, word.value)
      let new_total_score = 0;
      if (isCorrect) {
        await LanguageService.updateLanugage(req.app.get('db'), req.language.id, req.language.total_score + 1, head)
        console.log('totaatlscore', req.language.total_score + 1)
        new_total_score = req.language.total_score + 1
        console.log('new totoal csore', new_total_score)

      } else {
        await LanguageService.updateLanugage(req.app.get('db'), req.language.id, req.language.total_score, head)
        console.log('totaatlscore', req.language.total_score)
        new_total_score = req.language.total_score
        console.log('new totoal csore', new_total_score)
      }
    
      res
        .status(200)
        .json({
          nextWord: word.next.value.original,
          wordCorrectCount: word.value.correct_count,
          wordIncorrectCount: word.value.incorrect_count,
          totalScore: new_total_score,
          answer: word.value.translation,
          isCorrect: isCorrect
        })
      next()
    } catch (error) {
      next(error)
    }
  })

module.exports = languageRouter
