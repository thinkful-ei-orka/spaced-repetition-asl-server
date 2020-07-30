const LinkedList = require('../linked-list')
// const wordGuesser = require('../guessAlgorithm')
const languageRouter = require('./language-router')

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
        'description',
      )
      .where({ language_id })
      .orderBy('memory_value')
  },

  getNextWord(db, id) {
    // console.log('id in gnw', id)
    return db
      .from('language')
      .select(
        'language.id',
        'language.head',
        'language.total_score',
        'word.correct_count',
        'word.incorrect_count',
        'word.original',
        'word.description'
      )
      .leftJoin(
        'word',
        'language.head',
        'word.id'
      )
      .where('word.id', id)
      .first()
  },

  updateLanugage(db, language_id, total_score, headId) {
    console.log('headID', headId)
    return db
      .from('language')
      .update({
        total_score: total_score,
        head: headId
      })
      .where('id', language_id)
  },
  
  updateWord(db, word_id, wordValues) {
    return db
      .from('word')
      .update({
        memory_value: wordValues.memory_value,
        correct_count: wordValues.correct_count,
        incorrect_count: wordValues.incorrect_count,
        next: wordValues.next      
      })
      .where('word.id', word_id)
  },

  updateWordNext(db, word_id, nextId) {
    // console.log('nextId', nextId)
    // console.log('wordId', word_id)
    return db
      .from('word')
      .update({
        next: `${nextId}`
      })
      .where('word.id',`${word_id}`)
  },

  async getLinkedList(db, language_id, headId) {
    try {
      let words = await this.getLanguageWords(db, language_id)
      let wordList = new LinkedList
      console.log('words', words)
      words.forEach(word => {

        if(word.id === headId) {
          wordList.insertFirst(word)
        }

        else if (wordList.find(word.next)) {
          wordList.insertBefore(word, word.next)
        }

        else if(word.next === null) {
          wordList.makeEnd(word)
        }
        
        else if (!wordList.head) {
          wordList.insertFirst(word)
        }
        // else {
        //   wordList.insertAfter(word, wordList.head.value.id)
        // }
      })
      console.log('wordList is:',wordList)
      return wordList
    } catch(error) {
      console.log(error)
    }

    // if(word.id === headId) {
    //   wordList.insertBefore
    // }
    // next values

    // for (let i = 1; i <= )
    
    // need to set head
  },

  wordGuesser(list, guess) {

    let isCorrect = true
    let tempNode = list.head
    console.log('tempNode', tempNode)
    console.log('tempNode.value.translation.toLowerCase()', tempNode.value.translation.toLowerCase())
    console.log('what guess is:', guess.toLowerCase())
    if(tempNode.value.translation.toLowerCase() === guess.toLowerCase()) {
        isCorrect = true
        tempNode.value.correct_count = tempNode.value.correct_count + 1
        tempNode.value.memory_value = parseInt(tempNode.value.memory_value) * 2
        // console.log('should be true', isCorrect)
    } else {
        isCorrect = false;
        tempNode.value.incorrect_count = tempNode.value.incorrect_count + 1
        tempNode.value.memory_value = 1
        // console.log('should be false', isCorrect)
    }
 
    list.head = list.head.next
    if (parseInt(tempNode.value.memory_value) > list.size) {
        list.insertLast(tempNode.value)
    }
    else if (tempNode.value.memory_value > 1){
        list.insertAt(tempNode.value, parseInt(tempNode.value.memory_value))
    }
    else {
        list.insertAt(tempNode.value, 2)
    }

    // console.log('first word now:', list.head)
    
    let previous = list.findPrevious(tempNode.value.id)
    // console.log('previous in WordGuesser', previous)

    let returnValues = {
        isCorrect: isCorrect,
        word: { ...tempNode },
        previousId: previous.value.id,
        list: list,
        head: list.head.value.id
    }
    return returnValues
}

}

module.exports = LanguageService
