const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('User Endpoints', function () {
  let db

  const testUsers = helpers.makeUsersArray()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  /**
   * @description Register a user and populate their fields
   **/
  describe(`POST /api/user`, () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

    const requiredFields = ['username', 'password', 'name']

    requiredFields.forEach(field => {
      const registerAttemptBody = {
        username: 'test username',
        password: 'test password',
        name: 'test name',
      }

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete registerAttemptBody[field]

        return supertest(app)
          .post('/api/user')
          .send(registerAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })

    it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
      const userShortPassword = {
        username: 'test username',
        password: '1234567',
        name: 'test name',
      }
      return supertest(app)
        .post('/api/user')
        .send(userShortPassword)
        .expect(400, { error: `Password be longer than 8 characters` })
    })

    it(`responds 400 'Password be less than 72 characters' when long password`, () => {
      const userLongPassword = {
        username: 'test username',
        password: '*'.repeat(73),
        name: 'test name',
      }
      return supertest(app)
        .post('/api/user')
        .send(userLongPassword)
        .expect(400, { error: `Password be less than 72 characters` })
    })

    it(`responds 400 error when password starts with spaces`, () => {
      const userPasswordStartsSpaces = {
        username: 'test username',
        password: ' 1Aa!2Bb@',
        name: 'test name',
      }
      return supertest(app)
        .post('/api/user')
        .send(userPasswordStartsSpaces)
        .expect(400, { error: `Password must not start or end with empty spaces` })
    })

    it(`responds 400 error when password ends with spaces`, () => {
      const userPasswordEndsSpaces = {
        username: 'test username',
        password: '1Aa!2Bb@ ',
        name: 'test name',
      }
      return supertest(app)
        .post('/api/user')
        .send(userPasswordEndsSpaces)
        .expect(400, { error: `Password must not start or end with empty spaces` })
    })

    it(`responds 400 error when password isn't complex enough`, () => {
      const userPasswordNotComplex = {
        username: 'test username',
        password: '11AAaabb',
        name: 'test name',
      }
      return supertest(app)
        .post('/api/user')
        .send(userPasswordNotComplex)
        .expect(400, { error: `Password must contain one upper case, lower case, number and special character` })
    })

    it(`responds 400 'User name already taken' when username isn't unique`, () => {
      const duplicateUser = {
        username: testUser.username,
        password: '11AAaa!!',
        name: 'test name',
      }
      return supertest(app)
        .post('/api/user')
        .send(duplicateUser)
        .expect(400, { error: `Username already taken` })
    })

    describe(`Given a valid user`, () => {
      it(`responds 201, serialized user with no password`, () => {
        const newUser = {
          username: 'test username',
          password: '11AAaa!!',
          name: 'test name',
        }
        return supertest(app)
          .post('/api/user')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.username).to.eql(newUser.username)
            expect(res.body.name).to.eql(newUser.name)
            expect(res.body).to.not.have.property('password')
            expect(res.headers.location).to.eql(`/api/user/${res.body.id}`)
          })
      })

      it(`stores the new user in db with bcryped password`, () => {
        const newUser = {
          username: 'test username',
          password: '11AAaa!!',
          name: 'test name',
        }
        return supertest(app)
          .post('/api/user')
          .send(newUser)
          .expect(res =>
            db
              .from('user')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.username).to.eql(newUser.username)
                expect(row.name).to.eql(newUser.name)

                return bcrypt.compare(newUser.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
          )
      })

      it(`inserts 1 language with words for the new user`, () => {
        const newUser = {
          username: 'test username',
          password: '11AAaa!!',
          name: 'test name',
        }
        const expectedList = {
          name: 'ASL',
          total_score: 0,
          words: [
            { original: `https://thinkful-ei-orka.github.io/sp-asl-pics/1.jpg`, description: 'A person with bent fingers on their dominant hand moving their hand to tap against their outstretched non-dominant hand\'s palm',translation: 'again' },
            { original: `https://thinkful-ei-orka.github.io/sp-asl-pics/2.jpg`, description: 'A person with their hand against their face slowly moving their hand forward and down to stop approximately with their arm at a 45 degree angle',translation: 'good' },
            { original: `https://thinkful-ei-orka.github.io/sp-asl-pics/3.jpg`, description: 'A person with their hand outstretched touching their forehead and moving the arm out in a salute-like gesture',translation: 'hello' },
            { original: `https://thinkful-ei-orka.github.io/sp-asl-pics/4.jpg`, description: 'A person with their pointer finger up, eyebrows furrowed, shaking their head',translation: 'I don\'t understand' },
            { original: `https://thinkful-ei-orka.github.io/sp-asl-pics/5.jpg`, description: ' A person with their hand in a fist moving it in a circular motion, eyebrows furrowed',translation: 'I\'m sorry' },
            { original: `https://thinkful-ei-orka.github.io/sp-asl-pics/6.jpg`, description: 'A person with their pointer and index fingers tapping against their thumb',translation: 'no' },
            { original: `https://thinkful-ei-orka.github.io/sp-asl-pics/7.jpg`, description: 'A person with a flat palm against their chest, moving in a circular motion',translation: 'please' },
            { original: `https://thinkful-ei-orka.github.io/sp-asl-pics/8.jpg`, description: 'A person with their pointer and index fingers pointed at their eyes, moving their hand down and away from their body, then them pointing to another, then extending their thumb and pointer finger and moving their hand down and away from themselves',translation: 'see you later' },
            { original: `https://thinkful-ei-orka.github.io/sp-asl-pics/9.jpg`, description: 'A person with the fingertips of their middle fingers touching their chin, then tier hand down and away from their face',translation: 'thank you' },
            { original: `https://thinkful-ei-orka.github.io/sp-asl-pics/10.jpg`, description: 'A person moving their fist up and down',translation:  'yes' },
          ]
        }
        return supertest(app)
          .post('/api/user')
          .send(newUser)
          .then(res =>
            /*
            get languages and words for user that were inserted to db
            */
            db.from('language').select(
              'language.*',
              db.raw(
                `COALESCE(
                  json_agg(DISTINCT word)
                  filter(WHERE word.id IS NOT NULL),
                  '[]'
                ) AS words`
              ),
            )
            .leftJoin('word', 'word.language_id', 'language.id')
            .groupBy('language.id')
            .where({ user_id: res.body.id })
          )
          .then(dbLists => {
            expect(dbLists).to.have.length(1)

            expect(dbLists[0].name).to.eql(expectedList.name)
            expect(dbLists[0].total_score).to.eql(0)

            const dbWords = dbLists[0].words
            expect(dbWords).to.have.length(
              expectedList.words.length
            )
            console.log('expected List', expectedList)
            expectedList.words.forEach((expectedWord, w) => {
              console.log('expected word', expectedWord)
              console.log('w', w)
              console.log('expected word original', expectedWord.original)
              console.log('ex wo translation', expectedWord.translation)
              console.log('dbWords original', dbWords[w].original)
              expect(dbWords[w].original).to.eql(
                expectedWord.original
              )
              expect(dbWords[w].translation).to.eql(
                expectedWord.translation
              )
              expect(dbWords[w].memory_value).to.eql(1)
            })
          })
      })
    })
  })
})
