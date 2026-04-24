import React, { useState } from "react";

const Resources = () => {
  const [city, setCity] = useState("");
  const [resources, setResources] = useState([]);
  const [msg, setMsg] = useState("");

  const searchResources = async (e) => {
    e.preventDefault();
    setResources([]);
    setMsg("Searching resources...");

    try {
      const response = await fetch(
        `https://fullstackproject-mi89-subhan.onrender.com/api/resources/search?city=${encodeURIComponent(city)}`
      );

      const data = await response.json();

      if (response.ok) {
        setResources(data);
        setMsg(data.length === 0 ? "No resources found nearby." : "");
      } else {
        setMsg(data.msg || "Search failed.");
      }
    } catch (error) {
      setMsg("Something went wrong while searching resources.");
    }
  };

  return (
    <div className="container py-5">
      <div className="page-header">
        <h2>Coping Tools & Support</h2>
        <p>
          These tools are meant to help you pause, ground yourself, and find support when emotions feel heavy.
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card p-4 h-100">
            <h5>Box Breathing</h5>
            <p>Breathe in for 4, hold for 4, breathe out for 4, hold for 4.</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4 h-100">
            <h5>5-4-3-2-1 Grounding</h5>
            <p>Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste.</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4 h-100">
            <h5>Crisis Support</h5>
            <p>If you are in immediate danger or crisis, call or text 988.</p>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-5">
        <h4>Find Nearby Mental Health Resources</h4>
        <p className="text-muted">
          Search by city to find nearby clinics, hospitals, and counseling-related resources.
        </p>

        <form onSubmit={searchResources} className="row g-3">
          <div className="col-md-9">
            <input
              className="form-control"
              placeholder="Example: St. Louis, MO"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <button className="btn btn-primary w-100">Search</button>
          </div>
        </form>

        {msg && <p className="mt-3 text-muted">{msg}</p>}

        {resources.length > 0 && (
          <div className="mt-4">
            <h5>Nearby Resources</h5>

            {resources.map((item) => (
              <div key={item.id} className="border-bottom py-3">
                <strong>{item.name}</strong>
                <p className="mb-1 text-muted">Type: {item.type}</p>
                <p className="mb-0 text-muted">{item.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="quote-box mt-5">
        <h3>“You deserve support before things become overwhelming.”</h3>
        <p>Reaching out early can make a meaningful difference.</p>
      </div>
    </div>
  );
};

export default Resources;