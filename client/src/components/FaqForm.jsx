import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./FaqForm.css";
import { addFaq, updateFaq } from "../store/faqSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const FAQForm = ({ faq, onClose }) => {
  const dispatch = useDispatch();
  const [question, setQuestion] = useState(faq ? faq.question : "");
  const [answer, setAnswer] = useState(faq ? faq.answer : "");
  const [language, setLanguage] = useState("en");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFaq = { question, answer, language };
    if (faq) {
      dispatch(updateFaq({ id: faq._id, ...newFaq }));
    } else {
      dispatch(addFaq(newFaq));
    }
    onClose();
  };

  return (
    <div className="form-container">
      <h2>{faq ? "Edit FAQ" : "Add New FAQ"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <ReactQuill
          value={answer}
          onChange={setAnswer}
          className="quill-editor"
        />
        <select
          className="select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="bn">Bengali</option>
        </select>
        <div className="button-group">
          <button type="submit" className="btn">
            Save
          </button>
          <button onClick={onClose} type="button" className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

 export default FAQForm;
