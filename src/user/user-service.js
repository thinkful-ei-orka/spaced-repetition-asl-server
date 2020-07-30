const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UserService = {
  hasUserWithUserName(db, username) {
    return db('user')
      .where({ username })
      .first()
      .then(user => !!user)
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('user')
      .returning('*')
      .then(([user]) => user)
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character'
    }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeUser(user) {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
    }
  },
  populateUserWords(db, user_id) {
    return db.transaction(async trx => {
      const [languageId] = await trx
        .into('language')
        .insert([
          { name: 'ASL', user_id },
        ], ['id'])

      // when inserting words,
      // we need to know the current sequence number
      // so that we can set the `next` field of the linked language
      const seq = await db
        .from('word_id_seq')
        .select('last_value')
        .first()

      const languageWords = [
        ['https://thinkful-ei-orka.github.io/sp-asl-pics/1.jpg', 'A person with bent fingers on their dominant hand moving their hand to tap against their outstretched non-dominant hand\'s palm','again', 2],
        ['https://thinkful-ei-orka.github.io/sp-asl-pics/2.jpg', 'A person with their hand against their face slowly moving their hand forward and down to stop approximately with their arm at a 45 degree angle','good', 3],
        ['https://thinkful-ei-orka.github.io/sp-asl-pics/3.jpg', 'A person with their hand outstretched touching their forehead and moving the arm out in a salute-like gesture','hello', 4],
        ['https://thinkful-ei-orka.github.io/sp-asl-pics/4.jpg', 'A person with their pointer finger up, eyebrows furrowed, shaking their head','I don\'t understand', 5],
        ['https://thinkful-ei-orka.github.io/sp-asl-pics/5.jpg', ' A person with their hand in a fist moving it in a circular motion, eyebrows furrowed','I\'m sorry', 6],
        ['https://thinkful-ei-orka.github.io/sp-asl-pics/6.jpg', 'A person with their pointer and index fingers tapping against their thumb','no', 7],
        ['https://thinkful-ei-orka.github.io/sp-asl-pics/7.jpg', 'A person with a flat palm against their chest, moving in a circular motion','please', 8],
        ['https://thinkful-ei-orka.github.io/sp-asl-pics/8.jpg', 'A person with their pointer and index fingers pointed at their eyes, moving their hand down and away from their body, then them pointing to another, then extending their thumb and pointer finger and moving their hand down and away from themselves','see you later', 9],
        ['https://thinkful-ei-orka.github.io/sp-asl-pics/9.jpg', 'A person with the fingertips of their middle fingers touching their chin, then tier hand down and away from their face','thank you', 10],
        ['https://thinkful-ei-orka.github.io/sp-asl-pics/10.jpg', 'A person moving their fist up and down','yes', null],
      ]

      const [languageHeadId] = await trx
        .into('word')
        .insert(
          languageWords.map(([original, description, translation, nextInc]) => ({
            language_id: languageId.id,
            original,
            description,
            translation,
            next: nextInc
              ? Number(seq.last_value) + nextInc
              : null
          })),
          ['id']
        )

      await trx('language')
        .where('id', languageId.id)
        .update({
          head: languageHeadId.id,
        })
    })
  },
}

module.exports = UserService
