1. User can register with username, email and password

2. User can login with email and password

3. Layouts:
   
   1. Public: register, login
   
   2. Protected: submitted, created, profile, logout

4. Logged in user (later -- user) can see on the home page 3 tabs:
   
   1. Quizzes -- list of not solved quizzes
      
      query: getAllPublishedQuizzes
   
   2. In progress -- partially attempted quizzes
   
   3. Submitted --quizzes with all questions answered

5. User can navigate to Created (Quizzes) page where user sees 2 tabs:
   
   1. Published
      
      a list (DataTable) with
      
      fields: name, created at, number of participants, actions (view, edit, delete) edit action is available only
      
      published quizzes
   
   2. Unpublished (drafts)
      
      unpublished quizzes could be edited
      
      available actions: edit, delete
   
   There is a button "Create" in "Created Quizzes" page

6. User can create a new quiz

7. User can edit unpublished quiz

8. User can submit a quizanswer(s) to a question
