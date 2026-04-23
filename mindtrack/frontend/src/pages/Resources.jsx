import React from "react";

const Resources = () => {
  return (
    <div className="container py-5">
      <div className="page-header">
        <h2>Coping Tools & Support</h2>
        <p>
          These tools are meant to help you pause, ground yourself, and find support when emotions feel heavy.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card p-4 h-100">
            <h5>Box Breathing</h5>
            <p>
              Breathe in for 4, hold for 4, breathe out for 4, hold for 4.
              Repeat for a few rounds.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4 h-100">
            <h5>5-4-3-2-1 Grounding</h5>
            <p>
              Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4 h-100">
            <h5>Crisis Support</h5>
            <p>
              If you are in immediate danger or crisis, call or text 988 for support.
            </p>
          </div>
        </div>
      </div>

      <div className="quote-box mt-5">
        <h3>“You deserve support before things become unbearable.”</h3>
        <p>
          Checking in early can help you respond to stress instead of only reacting to it.
        </p>
      </div>
    </div>
  );
};

export default Resources;