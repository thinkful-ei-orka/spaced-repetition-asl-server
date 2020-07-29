BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'ASL', 1);

INSERT INTO "word" ("id", "language_id", "original", "description","translation", "next")
VALUES
  (1, 1, 'https://thinkful-ei-orka.github.io/sp-asl-pics/1.jpg', 'A person with bent fingers on their dominant hand moving their hand to tap against their outstretched non-dominant hand''s palm', 'again', 2),
  (2, 1, 'https://thinkful-ei-orka.github.io/sp-asl-pics/2.jpg', 'A person with their hand against their face slowly moving their hand forward and down to stop approximately with their arm at a 45 degree angle','good', 3),
  (3, 1, 'https://thinkful-ei-orka.github.io/sp-asl-pics/3.jpg', 'A person with their hand outstretched touching their forehead and moving the arm out in a salute-like gesture','hello', 4),
  (4, 1, 'https://thinkful-ei-orka.github.io/sp-asl-pics/4.jpg', 'A person with their pointer finger up, eyebrows furrowed, shaking their head','I don''t understand', 5),
  (5, 1, 'https://thinkful-ei-orka.github.io/sp-asl-pics/5.jpg', 'A person with their hand in a fist moving it in a circular motion, eyebrows furrowed','I''m sorry', 6),
  (6, 1, 'https://thinkful-ei-orka.github.io/sp-asl-pics/6.jpg', 'A person with their pointer and index fingers tapping against their thumb','no', 7),
  (7, 1, 'https://thinkful-ei-orka.github.io/sp-asl-pics/7.jpg', 'A person with a flat palm against their chest, moving in a circular motion','please', 8),
  (8, 1, 'https://thinkful-ei-orka.github.io/sp-asl-pics/8.jpg', 'A person with their pointer and index fingers pointed at their eyes, moving their hand down and away from their body, then them pointing to another, then extending their thumb and pointer finger and moving their hand down and away from themselves','see you later', 9),
  (9, 1, 'https://thinkful-ei-orka.github.io/sp-asl-pics/9.jpg', 'A person with the fingertips of their middle fingers touching their chin, then tier hand down and away from their face','thank you', 10),
  (10, 1, 'https://thinkful-ei-orka.github.io/sp-asl-pics/10.jpg', 'A person moving their fist up and down','yes', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
