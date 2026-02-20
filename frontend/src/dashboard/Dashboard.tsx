import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/Dashboard.css";

interface UserProfile {
  name?: string;
  username?: string;
  dob?: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  avg_sleep_hours?: number;
  avg_water_intake_liters?: number;
  scalp_type:string;
  skin_type:string;
}

const scalpTipsMap: Record<string, string[]> = {
  dry: [
    "Use a moisturizing shampoo",
    "Oil your scalp twice a week",
    "Avoid hot water while washing hair",
  ],
  oily: [
    "Wash hair 3–4 times a week",
    "Avoid heavy oils",
    "Use a mild clarifying shampoo",
  ],
  dandruff: [
    "Use anti-dandruff shampoo",
    "Avoid scratching the scalp",
    "Keep scalp clean and dry",
  ],
  normal: [
    "Maintain regular hair wash routine",
    "Use gentle hair products",
    "Massage scalp for blood circulation",
  ],
};

const skinTipsMap: Record<string, string[]> = {
  dry: [
    "Use a gentle hydrating cleanser",
    "Apply moisturizer twice daily",
    "Avoid hot showers",
  ],
  oily: [
    "Wash face twice daily",
    "Use oil-free moisturizer",
    "Avoid touching your face frequently",
  ],
  combination: [
    "Use lightweight gel-based moisturizer",
    "Avoid harsh cleansers",
    "Balance oily and dry areas separately",
  ],
  sensitive: [
    "Use fragrance-free products",
    "Do a patch test before new products",
    "Avoid harsh exfoliation",
  ],
  normal: [
    "Maintain basic skincare routine",
    "Use sunscreen daily",
    "Stay hydrated",
  ],
};

const lowEnergyTips: string[] = [
  "Get at least 7–8 hours of sleep daily",
  "Stay hydrated throughout the day",
  "Eat balanced meals with protein and fiber",
  "Avoid skipping breakfast",
  "Do light exercise or walking daily",
  "Reduce excessive screen time before sleep",
];


export default function Dashboard() {

  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const calculateAge = (dob?: string) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        navigate("/signin", { replace: true });
        return;
      }

      const { data, error } = await supabase
       .from("profiles")
       .select(`
         name,
         username,
         dob,
         gender,
         height_cm,
         weight_kg,
         avg_sleep_hours,
         avg_water_intake_liters,
         scalp_type,
         skin_type
       `)
      .eq("id", authData.user.id)
      .single();


      if (!isMounted) return;

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const age = calculateAge(profile?.dob);

  const heightM = profile?.height_cm ? profile.height_cm / 100 : 0;

  const bmi =
    profile?.height_cm && profile?.weight_kg
      ? Number((profile.weight_kg / (heightM * heightM)).toFixed(1))
      : null;

  const bmiStatus =
    bmi === null
      ? "—"
      : bmi < 18.5
      ? "Underweight"
      : bmi < 25
      ? "Healthy"
      : bmi < 30
      ? "Overweight"
      : "Obese";
  
  const scalpTips =
  profile?.scalp_type && scalpTipsMap[profile.scalp_type]
    ? scalpTipsMap[profile.scalp_type]
    : [];

const skinTips =
  profile?.skin_type && skinTipsMap[profile.skin_type]
    ? skinTipsMap[profile.skin_type]
    : [];

  const recommendedWater = profile?.weight_kg
    ? Number((profile.weight_kg * 0.033).toFixed(1))
    : 2.5;

  const currentWater = profile?.avg_water_intake_liters ?? 0;

  const waterProgress =
    recommendedWater > 0
      ? Math.min(100, Math.round((currentWater / recommendedWater) * 100))
      : 0;

 
  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  } 


  const hasHealthInfo = profile?.height_cm && profile?.weight_kg;

 
  return (
    <div className="dashboard-container">
      
      <div className="top-header">
        <div>
          <h2>Hello, {profile?.username || "User"} </h2>

          <p className="date-text">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <p>
            {age && `Age: ${age}`}{" "}
            {profile?.gender && `• ${profile.gender}`}
          </p>
        </div>

        <Link to="/dashboard/profile" className="edit-profile-btn">
          Edit Profile
        </Link>
      </div>

     
      <div className="overview-grid">
        <div className="overview-card">
          <h4>Height</h4>
          <p>{profile?.height_cm ?? "—"} cm</p>
        </div>

        <div className="overview-card">
          <h4>Weight</h4>
          <p>{profile?.weight_kg ?? "—"} kg</p>
        </div>

        <div className="overview-card ">
          <h4>BMI</h4>
          <p>{bmi ?? "—"}</p>
          <span className={`bmi-status ${
    bmiStatus === "Healthy" ? "bmi-healthy" : "bmi-unhealthy"
     }`}
       >
  {bmiStatus}
  </span>
        </div>
      </div>

      
     
        <div className="issues-grid">
         <section className="section">
    <h3 className="issue-header">Minor Health Concerns</h3>

    <div className="issues-row">
     
      <div className="issue-block">
        <h4>💇 Hair & Scalp Disorders</h4>

        {scalpTips.length > 0 ? (
          <ul className="tips-list">
            {scalpTips.map((tip, index) => (
              <li className="solution" key={index}>{tip}</li>
            ))}
          </ul>
        ) : (
          <p className="tips-empty">Add scalp type in profile to see tips</p>
        )}
      </div>

     
      <div className="issue-block">
        <h4>😟 Facial Skin Problems</h4>

        {skinTips.length > 0 ? (
          <ul className="tips-list">
            {skinTips.map((tip, index) => (
              <li className="solution" key={index}>{tip}</li>
            ))}
          </ul>
        ) : (
          <p className="tips-empty">Add skin type in profile to see tips</p>
        )}
      </div>

     
     <div className="issue-block">
  <h4>🔋 Low Energy</h4>

  {hasHealthInfo ? (
    <ul className="tips-list">
      {lowEnergyTips.map((tip, index) => (
        <li className="solution" key={index}>
          {tip}
        </li>
      ))}
    </ul>
  ) : (
    <p className="tips-empty">
      Add all health informations in profile to see tips
    </p>
  )}
</div>


    </div>
  </section>
</div>

     

    
      <section className="section">
        <h3 className="issue-header">Daily Habit Recommendations</h3>
        <div className="habits-grid">
          <div
          className="habit-card clickable"
              onClick={() => navigate("/diet")}
           >
           🥗 Balanced Diet
          </div>
     
         
          <div
          className="habit-card clickable"
              onClick={() => navigate("/exercise", {state:{age,bmi}})}
           >
           🧘 Morning Exercise
          </div>

          <div
            className="habit-card clickable"
            onClick={() =>
            navigate("/hydrate", {
            state: {age},
             })
          }
            >
           💧 Hydrate More
          </div>
          
          </div>
       
      </section>

     
      <div className="stats-grid">
        <div className="card">
          <h3>Water Intake</h3>
          <p className="value value-blue">{currentWater.toFixed(1)} L</p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${waterProgress}%` }}
            />
          </div>

          <p className="progress-text">
            {waterProgress}% of {recommendedWater} L
          </p>
        </div>

        <div className="card">
          <h3>Average Sleep</h3>
          <p className="value value-purple">
            {profile?.avg_sleep_hours ?? "—"} h
          </p>
          <p className="card-subtext">
            {profile?.avg_sleep_hours
              ? profile.avg_sleep_hours >= 7
                ? "Good quality sleep"
                : "Needs improvement"
              : "Add sleep data"}
          </p>
        </div>
      </div>
     
     
      <div className="prediction"> 
        <div className="prediction-good"> 
          <h4>With Good Habits</h4> 
          <ul> 
            <li>✅ Healthy weight</li> 
            <li>✅ High energy levels</li> 
            <li>✅ Reduced hair fall</li> 
            <li>✅ Glowing skin</li> 
            </ul> 
            </div> 
            <div className="prediction-bad"> 
              <h4>With Bad Habits</h4> 
            <ul> 
              <li>❌ Weight gain</li> 
              <li>❌ Weakness</li> 
              <li>❌ Increased hair fall</li> 
              <li>❌ Pimples & dark circles</li> 
            </ul> 
            </div> 
            </div>
    </div>
  );
}
