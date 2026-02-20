import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../styles/Diet.css";
import { Link } from "react-router-dom";
import ProfileIncomplete from "../components/ProfileIncomplete";

interface UserProfile {
  dob: string;
  height_cm: number;
  weight_kg: number;
  gender: "male" | "female";
  activity_level: "sedentary" | "light" | "moderate" | "active";
}

type CalorieLevel = "very_low" | "low" | "moderate" | "high";

export default function Diet() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        navigate("/signin", { replace: true });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("dob, height_cm, weight_kg, gender, activity_level")
        .eq("id", authData.user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <p>Loading diet plan...</p>;

  if (
    !profile?.dob ||
    !profile?.height_cm ||
    !profile?.weight_kg ||
    !profile?.gender ||
    !profile?.activity_level
  ) {

    return (
        <ProfileIncomplete
          title="Profile Incomplete"
          message="Please complete your profile to see diet plan."
         
        />
      );
    
  }

  /* ---------------- AGE FROM DOB ---------------- */
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(profile.dob);

  /* ---------------- BMR ---------------- */
  const bmr =
    profile.gender === "male"
      ? 10 * profile.weight_kg +
        6.25 * profile.height_cm -
        5 * age +
        5
      : 10 * profile.weight_kg +
        6.25 * profile.height_cm -
        5 * age -
        161;

  /* ---------------- ACTIVITY MULTIPLIER ---------------- */
  const activityMultiplier = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };

  const tdee = bmr * activityMultiplier[profile.activity_level];

 
  const minCalories = Math.round(tdee - 400);
  const maxCalories = Math.round(tdee + 200);

 
  const getCalorieLevel = (calories: number): CalorieLevel => {
    if (calories <= 1400) return "very_low";
    if (calories <= 1800) return "low";
    if (calories <= 2200) return "moderate";
    return "high";
  };

  const calorieLevel = getCalorieLevel(minCalories);

  
  const vegFoodMap: Record<CalorieLevel, string[]> = {
    very_low: [
      "Vegetable soup",
      "Steamed vegetables",
      "Fruit salad",
      "Buttermilk",
    ],
    low: [
      "Roti (1–2)",
      "Dal",
      "Vegetable curry",
      "Curd",
    ],
    moderate: [
      "Brown rice",
      "Paneer",
      "Dal",
      "Mixed vegetables",
      "Fruits",
    ],
    high: [
      "Rice / Roti",
      "Paneer",
      "Dal",
      "Vegetables",
      "Milk",
      "Nuts",
    ],
  };

  const nonVegFoodMap: Record<CalorieLevel, string[]> = {
    very_low: [
      "Boiled egg whites","Grilled fish","Chicken soup", ],
    low: [
      "Boiled eggs",
      "Grilled chicken",
      "Fish curry (light)",
    ],
    moderate: [
      "Eggs",
      "Chicken breast",
      "Fish",
      "Curd",
    ],
    high: [
      "Eggs",
      "Chicken",
      "Fish",
      "Lean mutton",
      "Milk",
    ],
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="diet-page">
      <Link to="/dashboard"
      ><button className="backDB">← Back To Dashboard</button></Link>
      <h2> Personalized Diet Plan</h2>

      <div className="diet-summary">
        <p>
          <strong>Age:</strong> {age} years
        </p>
        <p>
          <strong>Activity Level:</strong> {profile.activity_level}
        </p>
        <p className="calorie-range">
          <strong>Recommended Calories:</strong>{" "}
          {minCalories} – {maxCalories} kcal/day
        </p>
      </div>

      <div className="food-grid">
        <div className="food-card">
          <h4>🥦 Vegetarian Foods</h4>
          <ul>
            {vegFoodMap[calorieLevel].map((food, i) => (
              <li key={i}>{food}</li>
            ))}
          </ul>
        </div>

        <div className="food-card">
          <h4>🍗 Non-Vegetarian Foods</h4>
          <ul>
            {nonVegFoodMap[calorieLevel].map((food, i) => (
              <li key={i}>{food}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
