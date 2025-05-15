import React, { useState } from "react";
import "../AdminStyles.css";

function SendNews() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePostNews = (e) => {
    e.preventDefault();

    // Placeholder logic (replace with Firebase or backend integration)
    console.log("News Posted:", { title, content });
    setSuccessMessage("News update posted successfully!");
    setTitle("");
    setContent("");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div className="admin-section">
      <h2>Send News Update</h2>
      <form className="news-form" onSubmit={handlePostNews}>
        <label>News Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter headline"
          required
        />

        <label>News Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write the full news update here..."
          rows="6"
          required
        ></textarea>

        <button type="submit" className="admin-btn">Post News</button>

        {successMessage && <p className="success-msg">{successMessage}</p>}
      </form>
    </div>
  );
}

export default SendNews;
