import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProfileIncomplete from "../components/ProfileIncomplete";
import "../styles/habits.css";

interface UserProfile {
  gender?: string;
  dob?: string;
  height_cm?: number;
  weight_kg?: number;
  skin_type?: "oily" | "dry" | "normal" | "pimple";
}

interface Habit {
  id: number;
  title: string;
  time: string;
  completed: boolean;
}

export default function Habits() {
  const [userId, setUserId] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dayCompleted, setDayCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const todayISO = new Date().toISOString().split("T")[0];
  const todayKey = userId ? `habits-${userId}-${todayISO}` : null;

  /*  Load logged-in user */
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setLoading(false);
        return;
      }
      setUserId(data.user.id);
    };
    loadUser();
  }, []);

  /* Load saved habits OR generate new ones */
  useEffect(() => {
  if (!userId || !todayKey) return;

  const saved = localStorage.getItem(todayKey);

  //  If already completed, show success instantly
  if (saved === '"done"' || saved === "done") {
    setDayCompleted(true);
    setLoading(false);
    return;
  }

  const loadData = async () => {
    if (saved) {
      const parsed = JSON.parse(saved);
      setHabits(parsed);
      setLoading(false);
    } else {
      await loadProfileAndHabits();
    }
  };

  loadData();
}, [userId, todayKey]);



  /*  Load profile + generate habits */
  const loadProfileAndHabits = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("gender, dob, height_cm, weight_kg, skin_type")
      .eq("id", userId)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setProfile(data);
    const generated = generateDailyHabits(data);
    setHabits(generated);
    setLoading(false);
  };

  /*  Age helper */
  const getAge = (dob?: string) => {
    if (!dob) return 25;
    return Math.floor(
      (Date.now() - new Date(dob).getTime()) /
        (1000 * 60 * 60 * 24 * 365)
    );
  };

  /*  Habit generator */
  const generateDailyHabits = (profile: UserProfile): Habit[] => {
    let id = 1;
    const habits: Habit[] = [];

    const age = getAge(profile.dob);
    const heightM = (profile.height_cm || 170) / 100;
    const weight = profile.weight_kg || 65;
    const gender = profile.gender || "male";

    const bmi = weight / (heightM * heightM);

    /*  FOOD */
    habits.push({
      id: id++,
      title:
        bmi < 18.5
          ? "Eat high-protein and calorie-rich meals today"
          : bmi < 25
          ? "Maintain a balanced diet with fruits & vegetables"
          : "Focus on low-calorie, high-fiber meals today",
      time: "Meals",
      completed: false,
    });

    /* 💧 WATER */
    const waterLiters =
      gender === "male"
        ? (weight * 0.04).toFixed(1)
        : (weight * 0.035).toFixed(1);

    habits.push({
      id: id++,
      title: `Drink at least ${waterLiters} liters of water`,
      time: "All day",
      completed: false,
    });

    /*  SLEEP */
    habits.push({
      id: id++,
      title: `Sleep for ${age < 18 ? "8–9" : age <= 40 ? "7–8" : "7"} hours`,
      time: "Night",
      completed: false,
    });

    /*  SKIN */
    const skinMessages = {
      oily: "Wash your face 3 times today",
      dry: "Wash your face twice using a gentle cleanser",
      normal: "Wash your face morning and night",
      pimple: "Use a mild anti-acne face wash 3 times today",
    };

    habits.push({
      id: id++,
      title: skinMessages[profile.skin_type || "normal"],
      time: "Morning / Night",
      completed: false,
    });

    /*  EXERCISE */
    habits.push({
      id: id++,
      title: `Do ${
        age < 20 ? "25–35" : age < 35 ? "30–45" : "20–30"
      } minutes of exercise`,
      time: "Morning / Evening",
      completed: false,
    });

    /*  SCREEN */
    habits.push({
      id: id++,
      title: `Limit screen time to ${
        age < 18 ? "2" : age <= 40 ? "4" : "3"
      } hours`,
      time: "All day",
      completed: false,
    });

    /*  READING */
    habits.push({
      id: id++,
      title: "Read a book for at least 20 minutes",
      time: "Evening",
      completed: false,
    });

    return habits;
  };


  const updateWeeklyProgress = () => {
  if (!userId) return;

  const today = todayISO;
  const weeklyStorageKey = `weekly-progress-${userId}`;

  //  Get Monday of current week
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const weekStart = monday.toISOString().split("T")[0];

  const stored = JSON.parse(
    localStorage.getItem(weeklyStorageKey) ||
    '{"weekStart":null,"days":{}}'
  );

  let weeklyData = stored;

  //  If new week → reset
  if (stored.weekStart !== weekStart) {
    weeklyData = {
      weekStart: weekStart,
      days: {}
    };
  }

  weeklyData.days[today] = true;

  localStorage.setItem(
    weeklyStorageKey,
    JSON.stringify(weeklyData)
  );

  window.dispatchEvent(new Event("habitsCompleted"));
};




  /*  Save habits whenever they change */
  useEffect(() => {
    if (!todayKey || habits.length === 0) return;

    const allDone = habits.every((h) => h.completed);

    if (allDone) {
      localStorage.setItem(todayKey, "done");
       updateStreakAndProgress();
       updateWeeklyProgress();
       setTimeout(() => setDayCompleted(true), 300);

    } else {
      localStorage.setItem(todayKey, JSON.stringify(habits));
    }
  }, [habits, todayKey]);

  /*  Update streak */
  const updateStreakAndProgress = () => {
    if (!userId) return;

    const today = todayISO;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const streakKey = `streak-${userId}`;
    const streakData = JSON.parse(
      localStorage.getItem(streakKey) || '{"count":0,"lastDate":null,"longest":0}'
    );

    let newStreak = 1;

    if (streakData.lastDate === yesterdayStr) {
      newStreak = streakData.count + 1;
    } else if (streakData.lastDate === today) {
      newStreak = streakData.count;
    }

    const newStreakData = {
      count: newStreak,
      lastDate: today,
      longest: Math.max(newStreak, streakData.longest || 0),
    };

    localStorage.setItem(streakKey, JSON.stringify(newStreakData));
  };

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, completed: !h.completed } : h
      )
    );
  };

  if (loading && !dayCompleted) {
  return <div className="loading-container"><div className="loading-spinner"></div></div>;
}


  if (dayCompleted) {
    return (
      <div className="success-screen">
        <div className="success-box">
          <h1>🎉 Excellent!</h1>
          <p>You've completed all your habits for today.</p>
          <span>Come back tomorrow 🌱</span>
        </div>
      </div>
    );
  }

  if (
    profile &&
    (!profile.dob ||
      !profile.height_cm ||
      !profile.weight_kg ||
      !profile.gender ||
      !profile.skin_type)
  ) {
    return (
      <ProfileIncomplete
        title="Profile Incomplete"
        message="Please complete your profile to access daily habits."
      />
    );
  }

  return (
    <div className="habits-container">
      <h2>Today's Habits</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Complete all habits to increase your streak!
      </p>

      {habits.map((habit) => (
        <div key={habit.id} className="habit-card">
          <div>
            <h4>{habit.title}</h4>
            <p>{habit.time}</p>
          </div>
          <input
            type="checkbox"
            checked={habit.completed}
            onChange={() => toggleHabit(habit.id)}
          />
        </div>
      ))}

      <div className="habits-info">
        <p>✅ All habits completed = +1 streak day</p>
        <p>❌ Miss a day = Streak resets to 0</p>
      </div>
    </div>
  );
}
