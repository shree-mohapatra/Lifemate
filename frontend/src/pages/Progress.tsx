import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProfileIncomplete from "../components/ProfileIncomplete";
import "../styles/progress.css";

interface WeightPoint {
  date: string;
  weight: number;
}

export default function Progress() {
  const [weeklyCompletedDates, setWeeklyCompletedDates] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [weightData, setWeightData] = useState<WeightPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [weightHistoryExists, setWeightHistoryExists] = useState<boolean>(false);

  /* ---------------- DATE HELPERS ---------------- */
  const todayISO = () => new Date().toISOString().split("T")[0];

  // Helper to get yesterday's date
  const getYesterdayISO = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  };

  const getWeekDates = () => {
    const dates: string[] = [];
    const today = new Date();
    const day = today.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + mondayOffset + i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    loadProgress();
    
    // Listen for weight updates from Profile page
    const handleWeightUpdated = () => {
      console.log("Weight updated, refreshing progress data...");
      loadProgress();
    };
    
    // Listen for habits completion
    const handleHabitsCompleted = () => {
      loadProgress();
    };
    
    window.addEventListener('weightUpdated', handleWeightUpdated);
    window.addEventListener('habitsCompleted', handleHabitsCompleted);
    
    return () => {
      window.removeEventListener('weightUpdated', handleWeightUpdated);
      window.removeEventListener('habitsCompleted', handleHabitsCompleted);
    };
  }, []);


  const loadProgress = async () => {
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    setLoading(false);
    return;
  }

  const uid = auth.user.id;

  /* ---------------- FIXED STREAK LOGIC ---------------- */

  const streakKey = `streak-${uid}`;
  const today = todayISO();
  const yesterday = getYesterdayISO();

  const streakData = JSON.parse(
    localStorage.getItem(streakKey) ||
      '{"count":0,"lastDate":null,"longest":0}'
  );

  let newStreak = streakData.count || 0;

  if (!streakData.lastDate) {
    newStreak = 0;
  } else if (
    streakData.lastDate !== today &&
    streakData.lastDate !== yesterday
  ) {
    // ❗ Missed one or more days → RESET
    newStreak = 0;

    localStorage.setItem(
      streakKey,
      JSON.stringify({
        count: 0,
        lastDate: null,
        longest: streakData.longest || 0,
      })
    );
  }

  setStreak(newStreak);

  /* ---------------- WEEKLY PROGRESS ---------------- */

const weeklyStorageKey = `weekly-progress-${uid}`;

const storedWeekly = JSON.parse(
  localStorage.getItem(weeklyStorageKey) ||
  '{"weekStart":null,"days":{}}'
);

// Get current Monday
const now = new Date();
const day = now.getDay();
const mondayOffset = day === 0 ? -6 : 1 - day;
const monday = new Date(now);
monday.setDate(now.getDate() + mondayOffset);
const currentWeekStart = monday.toISOString().split("T")[0];

// If new week → reset
if (storedWeekly.weekStart !== currentWeekStart) {
  const newWeekly = {
    weekStart: currentWeekStart,
    days: {}
  };

  localStorage.setItem(
    weeklyStorageKey,
    JSON.stringify(newWeekly)
  );

  setWeeklyCompletedDates([]);
} else {
  const weekDates = getWeekDates();

  const completedThisWeek = weekDates.filter(
    (d) => storedWeekly.days?.[d]
  );

  setWeeklyCompletedDates(completedThisWeek);
}


  /* ---------------- WEIGHT HISTORY ---------------- */

  try {
    const { data: weights, error } = await supabase
      .from("weight_history")
      .select("weight_kg, recorded_at")
      .eq("user_id", uid)
      .order("recorded_at", { ascending: false })
      .limit(5);

    if (error || !weights || weights.length === 0) {
      setWeightData([]);
      setWeightHistoryExists(false);
    } else {
      const chronological = [...weights].reverse();

      const formatted = chronological.map((w) => ({
        date: w.recorded_at.split("T")[0],
        weight: parseFloat(w.weight_kg) || 0,
      }));

      setWeightData(formatted);
      setWeightHistoryExists(true);
    }
  } catch {
    setWeightHistoryExists(false);
  }

  setLoading(false);
};

  /* ---------------- WEIGHT HISTORY CHECK ---------------- */
  if (!loading && !weightHistoryExists) {
    const weeklyPercent = Math.round((weeklyCompletedDates.length / 7) * 100);
    
    return (
      <div className="progress-container">
        {/* Remove or fix the underline in your CSS */}
        <h2 className="progress-title">Your Progress</h2>
        
        {/* Show streak and weekly progress even when no weight data */}
        <div className="progress-grid">
          <div className="progress-card streak-card">
            <h3>🔥 Daily Streak</h3>
            <p className="streak-count">{streak} days</p>
            <small style={{opacity: 0.8}}>
              Complete all habits today to increase!
            </small>
          </div>

          <div className="progress-card">
            <h3>Weekly Completion</h3>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${weeklyPercent}%` }}
              />
            </div>
            <p>{weeklyPercent}% completed ({weeklyCompletedDates.length}/7 days)</p>
          </div>
        </div>

        {/* This Week Section */}
        <div className="bar-chart">
          <h3>This Week</h3>
          <div className="bars">
            {getWeekDates().map((date, i) => {
              const done = weeklyCompletedDates.includes(date);
              const dayNames = ["M", "T", "W", "T", "F", "S", "S"];
              const today = new Date().toISOString().split('T')[0];
              const isToday = date === today;
              
              return (
                <div key={date} className="bar-wrapper">
                  <div className={`bar ${done ? "done" : ""} ${isToday ? "today" : ""}`} />
                  <span className={isToday ? "today-label" : ""}>
                    {dayNames[i]}
                    {isToday && " (Today)"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Show ProfileIncomplete for weight section only */}
        <div className="weight-graph">
          <ProfileIncomplete
            title="No Weight Data"
            message="Please update your weight in the Profile page to see your weight progress graph."
          />
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;

  /* ---------------- CALCULATIONS ---------------- */
  const weekDates = getWeekDates();
  const weeklyPercent = Math.round((weeklyCompletedDates.length / 7) * 100);

  const chartData = weightData; 
  const weights = chartData.map(d => d.weight);

  /* ---------------- FIXED BAR HEIGHT CALCULATION ---------------- */
  const calculateBarHeight = (weight: number, index: number, allWeights: number[]) => {
    if (allWeights.length === 1) {
      return 100;
    }
    
    const minWeight = Math.min(...allWeights);
    const maxWeight = Math.max(...allWeights);
    const range = maxWeight - minWeight;
    
    if (range < 2) {
      const position = index / (allWeights.length - 1);
      return 50 + (position * 50);
    }
    
    const normalized = (weight - minWeight) / range;
    return 30 + (normalized * 90);
  };

  return (
    <div className="progress-container">
      {/* Use a class to avoid the underline */}
      <h2 className="progress-title">Your Progress</h2>
      
      <div className="progress-grid">
        <div className="progress-card streak-card">
          <h3>🔥 Daily Streak</h3>
          <p className="streak-count">{streak} days</p>
          <small style={{opacity: 0.8}}>
            Complete all habits today to increase!
          </small>
        </div>

        <div className="progress-card">
          <h3>Weekly Completion</h3>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${weeklyPercent}%` }}
            />
          </div>
          <p>{weeklyPercent}% completed ({weeklyCompletedDates.length}/7 days)</p>
        </div>
      </div>

      <div className="bar-chart">
        <h3>This Week</h3>
        <div className="bars">
          {weekDates.map((date, i) => {
            const done = weeklyCompletedDates.includes(date);
            const dayNames = ["M", "T", "W", "T", "F", "S", "S"];
            const today = new Date().toISOString().split('T')[0];
            const isToday = date === today;
            
            return (
              <div key={date} className="bar-wrapper">
                <div className={`bar ${done ? "done" : ""} ${isToday ? "today" : ""}`} />
                <span className={isToday ? "today-label" : ""}>
                  {dayNames[i]}
                  {isToday && " (Today)"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="weight-graph">
        <h3>Weight Progress </h3>

        {weightData.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">No weight data available</p>
            <p style={{color: '#6c757d', fontSize: '14px', textAlign: 'center', marginTop: '10px'}}>
              Update your weight in the Profile page to see your progress graph.
            </p>
          </div>
        ) : (
          <>
            <div className="weight-bars">
              {chartData.map((point, index) => {
                const dateObj = new Date(point.date);
                const dayLabel = dateObj.toLocaleDateString('en-US', { 
                  month: 'short',
                  day: 'numeric'
                });
                
                const height = calculateBarHeight(point.weight, index, weights);
                
                return (
                  <div key={index} className="weight-bar">
                    <div
                      className="weight-fill"
                      style={{
                        height: `${height}px`,
                      }}
                    />
                    <span className="weight-date">{dayLabel}</span>
                    <div className="weight-label">{point.weight.toFixed(1)}kg</div>
                  </div>
                );
              })}
            </div>
            
            <div className="weight-stats">
              <div className="stat">
                <div className="stat-label">Showing</div>
                <div className="stat-value">{weightData.length} records</div>
              </div>
              {weightData.length >= 2 && (
                <>
                  <div className="stat">
                    <div className="stat-label">Oldest</div>
                    <div className="stat-value">{weightData[0].weight.toFixed(1)}kg</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Newest</div>
                    <div className="stat-value">{weightData[weightData.length - 1].weight.toFixed(1)}kg</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Change</div>
                    <div className={`stat-value ${
                      weightData[weightData.length - 1].weight < weightData[0].weight 
                        ? 'positive' 
                        : 'negative'
                    }`}>
                      {weightData[weightData.length - 1].weight - weightData[0].weight > 0 ? '+' : ''}
                      {(weightData[weightData.length - 1].weight - weightData[0].weight).toFixed(1)}kg
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}