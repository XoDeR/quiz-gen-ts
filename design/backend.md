### Entities

**user** (table users)

| SQL        | JSON              |
| ---------- | ----------------- |
| id         | id (uuid): string |
| username   | username: string  |
| email      | email: string     |
| password   | password          |
| created_at | createdAt         |
| updated_at | updatedAt         |

```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE, -- required + unique
    email VARCHAR(255) NOT NULL UNIQUE, -- required + unique
    password VARCHAR(255) NOT NULL, -- required
    created_at TIMESTAMP NOT NULL DEFAULT now(), -- record creation time
    updated_at TIMESTAMP NOT NULL DEFAULT now()  -- record update time
)
```

---

quizzes() -- get all quizzes created by user; user has many quizzes

submissions() -- get all submissions created by user; user has many submissions

---

**quiz** (table quizzes)

| SQL          | JSON                                 |
| ------------ | ------------------------------------ |
| id           | id (uuid): string                    |
| title        | title: string required               |
| is_published | isPublished: boolean, default: false |
| user_id      | userId                               |
| created_at   | createdAt                            |
| updated_at   | updatedAt                            |

---

questions() -- get all questions; quiz has many questions

---

**question** (table questions)

| SQL                     | JSON                                                                                                        |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| id                      | id (uuid): string                                                                                           |
| text                    | text: string                                                                                                |
| type                    | type: short int , default 0 (0 --single (single choice question); 1 -- multiple (multiple choice question)) |
| display_order           | displayOrder: integer, default 0 (order within a quiz)                                                      |
| quiz_id (FK id quizzes) | quizId                                                                                                      |

answerOptions() -- get answerOptions for question

correctAnswers() -- get correct answers for question

**answerOption** (table answer_options)

id

text

display_order

question_id

id (uuid): string

text: string

order: integer, default 0 (order within a quiz)

questionId (question_id) (FK): string

**correctAnswer** (table correct_answers)

id (uuid): string

questionId (FK id questions)

answerOptionId (FK id answer_options)

**submission** (table submissions)

id (uuid) string

result string default NULL (format: "10/20" 10 correct out of 20)

completed boolean

userId (FK id users)

quizId (FK id quizzes)

updatedAt

createdAt

**attemptedAnswer** (table attempted_answers)

id (uuid) string

userId (FK id users)

quizId (FK id quizzes)

submissionId (FK id submissions)

questionId (FK id questions)

answerOptionId (FK id answer_options)

### Relationships

**user** has many **quizzes**; those are the quizzes created by user

**user** has many **submissions**

**quiz** has many **questions**

**question** has many **answerOptions**

### Queries

getAllPublishedQuizzes()

```sql
SELECT * FROM quizzes WHERE is_published = TRUE
```

getPublishedQuizzesCreatedByUser(userId)

```sql
SELECT * FROM quizzes WHERE user_id = [userId] AND is_published = TRUE
```

getUnPublishedQuizzesCreatedByUser(userId)

```sql
SELECT * FROM quizzes WHERE user_id = [userId] AND is_published = FALSE
```

### Mutations

createQuiz(questions: [{ order: 0, text: 'abc', answerOptions: [{ order: 0, text: 'bcd' }, {}],  }, {}, {}])

createSubmission()
