import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store";

const Journal = () => {
  const { token } = useContext(Context);
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchEntries = async () => {
    const response = await fetch(
      "https://improved-pancake-pvg5q46wx572776-5000.app.github.dev/api/journal",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      setEntries(data);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEntries();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `https://improved-pancake-pvg5q46wx572776-5000.app.github.dev/api/journal/${editingId}`
      : "https://improved-pancake-pvg5q46wx572776-5000.app.github.dev/api/journal";

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    });

    setTitle("");
    setContent("");
    setEditingId(null);
    fetchEntries();
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
  };

  const handleDelete = async (id) => {
    await fetch(
      `https://improved-pancake-pvg5q46wx572776-5000.app.github.dev/api/journal/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchEntries();
  };

  return (
    <div className="container py-5">
      <div className="page-header">
        <h2>Private Journal</h2>
        <p>
          Use this space to reflect, process your thoughts, and keep track of what has been on your mind.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-5">
          <div className="card p-4">
            <h4 className="mb-3">
              {editingId ? "Edit Entry" : "New Journal Entry"}
            </h4>

            <form onSubmit={handleSubmit}>
              <input
                className="form-control mb-3"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="form-control mb-3"
                placeholder="Write here..."
                rows="6"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <button className="btn btn-success">
                {editingId ? "Update Entry" : "Add Entry"}
              </button>
            </form>
          </div>

          <div className="info-box mt-4">
            <h5>Journal prompt</h5>
            <p>
              What is one thing you felt today that you did not fully say out loud?
            </p>
          </div>
        </div>

        <div className="col-md-7">
          <h4 className="mb-3">Your Entries</h4>

          {entries.length === 0 && (
            <div className="card p-4">
              <p className="mb-0 text-muted">
                No entries yet. Start with one small reflection.
              </p>
            </div>
          )}

          {entries.map((entry) => (
            <div key={entry.id} className="card p-4 mb-3">
              <h5>{entry.title}</h5>
              <p>{entry.content}</p>

              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(entry)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(entry.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journal;