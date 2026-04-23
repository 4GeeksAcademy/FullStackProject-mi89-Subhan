import React, { useContext, useState } from "react";
import { Context } from "../store";

const Mood = () => {
  const { token } = useContext(Context);
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "https://improved-pancake-pvg5q46wx572776-5000.app.github.dev/api/moods",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mood, note })
      }
    );

    if (response.ok) {
      setMsg("Mood saved");
      setMood("");
      setNote("");
    } else {
      setMsg("Could not save mood");
    }
  };

  return (
    <div className="container py-5">
      <div className="page-header">
        <h2>Mood Check-In</h2>
        <p>
          Take a moment to name how you feel. Tracking your mood can help you notice patterns over time.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-7">
          <div className="card p-4">
            <h4 className="mb-3">How are you feeling today?</h4>

            <form onSubmit={handleSubmit}>
              <select
                className="form-select mb-3"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              >
                <option value="">Select your mood</option>
                <option value="Happy">Happy</option>
                <option value="Calm">Calm</option>
                <option value="Stressed">Stressed</option>
                <option value="Sad">Sad</option>
                <option value="Overwhelmed">Overwhelmed</option>
              </select>

              <textarea
                className="form-control mb-3"
                placeholder="What contributed to this mood?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <button className="btn btn-primary">Save Mood</button>
            </form>

            {msg && <p className="mt-3">{msg}</p>}
          </div>
        </div>

        <div className="col-md-5">
          <div className="info-box">
            <h5>Why mood tracking helps</h5>
            <p>
              A quick check-in can make emotions feel less overwhelming and easier to understand.
            </p>
          </div>

          <div className="card p-4 mt-4">
            <h5>Try noticing:</h5>
            <span className="resource-pill">Sleep</span>
            <span className="resource-pill">School</span>
            <span className="resource-pill">Family</span>
            <span className="resource-pill">Stress</span>
            <span className="resource-pill">Energy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mood;