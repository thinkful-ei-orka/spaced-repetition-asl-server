const LinkedList = require('../linked-list')
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
      //array, so we find and take out the head obj to start LL
      let headObj = words.find(word => word.id === headId)
      let headInd = words.indexOf(headObj)
      let head = words.splice(headInd, 1)

      wordList.insertFirst(head[0])
      //set nextId to the next value of the head
      let nextId = head[0].next
      //search through the words to find it and insert into LL
      let currWord = words.find(word => word.id === nextId)
      wordList.makeEnd(currWord)

      //reset nextId to the currWord's next value
      nextId = currWord.next

      /** 
       * as long as currWord exists, go through each next value
       * until it is null, inserting as we go
      */
      while(currWord !== null) {
        //update currWord and reset nextId
        currWord = words.find(word => word.id === nextId)
        wordList.makeEnd(currWord)
        nextId = currWord.next

        if(nextId === null) {
          //if no next, then set currWord to null to escape loop
          currWord = null
        } 
      }
      return wordList
    } catch(error) {
    console.log(error)
    }
  },

  wordGuesser(list, guess) {
    //set up vars
    let isCorrect = true
    let tempNode = list.head

    //check is correct or not
    if(tempNode.value.translation.toLowerCase() === guess.toLowerCase()) {
      isCorrect = true
      tempNode.value.correct_count = tempNode.value.correct_count + 1
      tempNode.value.memory_value = parseInt(tempNode.value.memory_value) * 2
    } else {
      isCorrect = false
      tempNode.value.incorrect_count = tempNode.value.incorrect_count + 1
      tempNode.value.memory_value = 1
    }
    //set the head to head's next val
    list.head = list.head.next

    //check memory_value to decide where to place guessed question
    if (parseInt(tempNode.value.memory_value) > list.size) {
        list.insertLast(tempNode.value)
    }
    else if (tempNode.value.memory_value > 1){
        list.insertAt(tempNode.value, parseInt(tempNode.value.memory_value))
    }
    else {
        list.insertAt(tempNode.value, 2)
    }
    
    //get the previous ID for route useage
    let previous = list.findPrevious(tempNode.value.id)

    //set a return variable
    let returnValues = {
        isCorrect: isCorrect,
        word: { ...tempNode },
        previousId: previous.value.id,
        list: list,
        head: list.head.value.id
    }
    return returnValues
  },

}

module.exports = LanguageService
