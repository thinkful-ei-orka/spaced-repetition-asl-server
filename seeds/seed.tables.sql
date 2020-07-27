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

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, '/src/images/tinified-10signs/1.jpg', 'again', 2),
  (2, 1, '/src/images/tinified-10signs/2.jpg', 'good', 3),
  (3, 1, '/src/images/tinified-10signs/3.jpg', 'hello', 4),
  (4, 1, '/src/images/tinified-10signs/4.jpg', 'I don''t understand', 5),
  (5, 1, '/src/images/tinified-10signs/5.jpg', 'I''m sorry', 6),
  (6, 1, '/src/images/tinified-10signs/6.jpg', 'no', 7),
  (7, 1, '/src/images/tinified-10signs/7.jpg', 'please', 8),
  (8, 1, '/src/images/tinified-10signs/8.jpg', 'see you later', 9),
  (9, 1, '/src/images/tinified-10signs/9.jpg', 'thank you', 10),
  (10, 1, '/src/images/tinified-10signs/10.jpg', 'yes', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
