import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFaqs, deleteFaq } from "../store/faqSlice";
import './AdminPanel.css';
import FAQForm from '../components/FaqForm';
import "react-quill/dist/quill.snow.css";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { faqs, loading } = useSelector((state) => state.faqs);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    dispatch(fetchFaqs(language));
  }, [dispatch, language]);

  const handleEdit = (faq) => {
    setSelectedFaq(faq);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteFaq(id));
  };

  return (
    <div className="container">
      <h1 className="title">Admin Panel - FAQ Management</h1>
      <div className="controls">
        <select className="select" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="bn">Bengali</option>
        </select>
        <button className="btn" onClick={() => setShowForm(true)}>Add New FAQ</button>
      </div>

      {showForm && <FAQForm faq={selectedFaq} onClose={() => setShowForm(false)} />}

      <table className="table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3">Loading...</td>
            </tr>
          ) : (
            faqs.map((faq) => (
              <tr key={faq._id}>
                <td>{faq[`question_${language}`] || faq.question}</td>
                <td>
                  <div className="answer" dangerouslySetInnerHTML={{ __html: faq[`answer_${language}`] || faq.answer }} />
                </td>
                <td>
                  <button className="btn" onClick={() => handleEdit(faq)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(faq._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
