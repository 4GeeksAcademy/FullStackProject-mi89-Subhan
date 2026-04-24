import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from "recharts";

const moodMap = {
  Sad: 1,
  Overwhelmed: 2,
  Stressed: 3,
  Calm: 4,
  Happy: 5
};

const Dashboard = () => {
  const { token, user } = useContext(Context);
  const [moods, setMoods] = useState([]);
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const moodRes = await fetch(
        "https://fullstackproject-mi89-subhan.onrender.com/api/moods",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const journalRes = await fetch(
        "https://fullstackproject-mi89-subhan.onrender.com/api/journal",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (moodRes.ok) setMoods(await moodRes.json());
      if (journalRes.ok) setJournals(await journalRes.json());
    };

    if (token) fetchData();
  }, [token]);

  const chartData = [...moods].reverse().map((item, index) => ({
    day: `Day ${index + 1}`,
    score: moodMap[item.mood] || 0
  }));

  const moodCounts = ["Happy", "Calm", "Stressed", "Sad", "Overwhelmed"].map(
    (moodName) => ({
      mood: moodName,
      count: moods.filter((m) => m.mood === moodName).length
    })
  );

  const averageMood =
    moods.length > 0
      ? (
          moods.reduce((sum, item) => sum + (moodMap[item.mood] || 0), 0) /
          moods.length
        ).toFixed(1)
      : "0.0";

  const latestMood = moods.length > 0 ? moods[0].mood : "No mood yet";

  return (
    <div className="container py-5">
      <div className="page-header">
        <h2>{user ? `Welcome back, ${user.email}` : "Your Dashboard"}</h2>
        <p>
          Your dashboard gives you a quick overview of your recent moods,
          journal activity, and emotional trends.
        </p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <h2>{moods.length}</h2>
            <p>Total mood check-ins</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="stat-card">
            <h2>{journals.length}</h2>
            <p>Total journal entries</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="stat-card">
            <h2>{averageMood}</h2>
            <p>Average mood score out of 5</p>
          </div>
        </div>
      </div>

      <div className="quote-box mb-4">
        <h3>Latest mood: {latestMood}</h3>
        <p>
          Small check-ins help you notice patterns before stress becomes harder
          to manage.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-7">
          <div className="card p-4 h-100">
            <h4>Mood Trend</h4>
            <p className="text-muted">
              This chart shows how your mood score changes over time.
            </p>

            {chartData.length === 0 ? (
              <p className="text-muted mb-0">
                No mood data yet. Add a mood check-in to see your trend.
              </p>
            ) : (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[1, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#0071bc" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-5">
          <div className="card p-4 h-100">
            <h4>Mood Breakdown</h4>
            <p className="text-muted">
              This shows how often you selected each mood.
            </p>

            {moods.length === 0 ? (
              <p className="text-muted mb-0">
                Your mood breakdown will appear after you log moods.
              </p>
            ) : (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodCounts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mood" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2368a2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-md-6">
          <div className="card p-4">
            <h4>Recent Moods</h4>

            {moods.length === 0 ? (
              <p className="text-muted mb-0">
                No moods logged yet. Start by adding your first mood check-in.
              </p>
            ) : (
              moods.slice(0, 5).map((m) => (
                <div key={m.id} className="border-bottom py-2">
                  <strong>{m.mood}</strong> - {m.note || "No note"}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4">
            <h4>Recent Journal Entries</h4>

            {journals.length === 0 ? (
              <p className="text-muted mb-0">
                No journal entries yet. Write your first reflection to get
                started.
              </p>
            ) : (
              journals.slice(0, 5).map((j) => (
                <div key={j.id} className="border-bottom py-2">
                  <strong>{j.title}</strong>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;