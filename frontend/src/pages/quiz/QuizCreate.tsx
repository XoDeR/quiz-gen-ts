export default function QuizCreate() {
  return (
    <div className="w-full">
      <h1 className="text-3xl">Create New Quiz</h1>
      <div className="p-20 border rounded-md">
        <div>
          <h3 className="text-xl">1. When JS was invented</h3>
          <input type="radio" id="html" name="fav_language" value="HTML" />
          <label htmlFor="html">HTML</label><br />
          <input type="radio" id="css" name="fav_language" value="CSS" />
          <label htmlFor="css">CSS</label><br />
          <input type="radio" id="javascript" name="fav_language" value="JavaScript" />
          <label htmlFor="javascript">JavaScript</label>
        </div>

      </div>
    </div>
  );
}