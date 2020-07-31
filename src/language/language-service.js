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
      // console.log('words in gLL', words)
      let wordList = new LinkedList
      //array, so we take out the head obj and start LL
      let headObj = words.find(word => word.id === headId)
      let headInd = words.indexOf(headObj)
      let head = words.slice(headInd, 1)

      // console.log('head', head)
      wordList.insertFirst(head[0])
      //set nextId to the next value of the head
      let nextId = head[0].next
      //search through the words to find it and insert into LL
      let currWord = words.find(word => word.id === nextId)
      wordList.makeEnd(currWord)

      //reset nextId to the currWord's next value
      nextId = currWord.next
      // currWord = words.find(word => word.id === nextId)

      /** 
       * as long as currWord exists, go through each next value
       * until it is null, inserting as we go
      */
      while(currWord !== null) {
        // console.log('continues')
        //update currWord and rest nextId
        currWord = words.find(word => word.id === nextId)
        // console.log('currWord now:', currWord)
        wordList.makeEnd(currWord)
        // console.log(`added to linkedList`)
        nextId = currWord.next
        // console.log('nextId is:', nextId)
        if(nextId === null) {
          // console.log('while nextId =/= null')
          //if no next, then set currWord to null to escape loop
          currWord = null
        } 
        // console.log('next loop')
      }
      // console.log('wordList is:', wordList)
      return wordList
    } catch(error) {
    console.log(error)
  }

      // words.forEach(word => {

      //   if(word.id === headId) {
      //     wordList.insertFirst(word)
      //   }

      //   else if (wordList.find(word.next)) {
      //     wordList.insertBefore(word, word.next)
      //   }

      //   else if(word.next === null) {
      //     wordList.makeEnd(word)
      //   }
        
      //   else if (!wordList.head) {
      //     wordList.insertFirst(word)
      //   }
        // else {
        //   wordList.insertAfter(word, wordList.head.value.id)
        // }
    //   })
    //   console.log('wordList is:',wordList)
    //   return wordList
    // } catch(error) {
    //   console.log(error)
    // }

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
    console.log('initial list head', tempNode)
    if(tempNode.value.translation.toLowerCase() === guess.toLowerCase()) {
        isCorrect = true
        tempNode.value.correct_count = tempNode.value.correct_count + 1
        tempNode.value.memory_value = parseInt(tempNode.value.memory_value) * 2
        console.log('guess correct?', isCorrect)
    } else {
        isCorrect = false;
        tempNode.value.incorrect_count = tempNode.value.incorrect_count + 1
        tempNode.value.memory_value = 1
        console.log('guess correct?', isCorrect)
    }
 
    list.head = list.head.next
    console.log('new list.head', list.head)
    if (parseInt(tempNode.value.memory_value) > list.size) {
        console.log(tempNode.value.memory_value, 'is greater than', list.size)
        console.log('inserting to last of list:', tempNode.value)
        list.insertLast(tempNode.value)
    }
    else if (tempNode.value.memory_value > 1){
        console.log('else if of tempnode mem_val greater than 1', tempNode.value.memory_value)
        list.insertAt(tempNode.value, parseInt(tempNode.value.memory_value))
    }
    else {
        console.log('else set to second place: mem_val', tempNode.value.memory_value)
        list.insertAt(tempNode.value, 2)
    }

    // console.log('first word now:', list.head)
    
    let previous = list.findPrevious(tempNode.value.id)
    // console.log('previous in WordGuesser', previous)
    console.log('LIST AFTER COMPLETE GUESS')
    this.display(list)

    let returnValues = {
        isCorrect: isCorrect,
        word: { ...tempNode },
        previousId: previous.value.id,
        list: list,
        head: list.head.value.id
    }
    return returnValues
},


display(list) {
  let currentNode = list.head;
  while (currentNode !== null) {
      console.log(currentNode);
      currentNode = currentNode.next
  }
}

}

module.exports = LanguageService
