import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <section className="home-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-7">
              <span className="badge-soft mb-3 d-inline-block">
                College Mental Wellness
              </span>

              <h1 className="display-4 fw-bold mb-3">
                Track your mind, not just your schedule.
              </h1>

              <p className="lead mb-4">
                MindTrack helps students check in with their emotions, journal privately,
                and notice patterns before stress builds up.
              </p>

              <Link to="/signup" className="btn btn-primary me-2">
                Get Started
              </Link>

              <Link to="/resources" className="btn btn-outline-primary">
                View Resources
              </Link>
            </div>

            <div className="col-md-5">
              <img
                src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=900&q=80"
                alt="Journal and coffee on a calm desk"
                className="img-fluid hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="stat-card">
              <h2>23.1%</h2>
              <p>of U.S. adults lived with a mental illness in 2022.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card">
              <h2>1 in 5+</h2>
              <p>U.S. adults experience mental illness each year.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card">
              <h2>40%</h2>
              <p>of high school students reported persistent sadness or hopelessness in 2023.</p>
            </div>
          </div>
        </div>

        <p className="small text-muted mt-3">
          Data adapted from NIMH and CDC public mental health statistics.
        </p>
      </section>

      <section className="container pb-5">
        <div className="quote-box">
          <h3>“Small check-ins can lead to bigger self-awareness.”</h3>
          <p>
            MindTrack is not therapy, but it gives students a place to pause,
            reflect, and recognize emotional patterns.
          </p>
        </div>
      </section>

      <section className="container pb-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card p-4 h-100">
              <h5>Mood Tracking</h5>
              <p>Log how you feel and see your recent emotional patterns.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 h-100">
              <h5>Private Journaling</h5>
              <p>Write, edit, and delete personal reflections in one secure place.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 h-100">
              <h5>Coping Resources</h5>
              <p>Use grounding tools, breathing exercises, and support resources.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;