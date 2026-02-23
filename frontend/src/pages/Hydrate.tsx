import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import ProfileIncomplete from "../components/ProfileIncomplete";
import "../styles/hydrate.css";

interface Profile {
  dob: string;
  height_cm: number;
  weight_kg: number;
  gender: "male" | "female";
}

export default function HydrateMore() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();
  const passedAge = location.state?.age;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error("User not logged in");

      const { data, error } = await supabase
        .from("profiles")
        .select("dob, height_cm, weight_kg, gender")
        .eq("id", authData.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      setError("Unable to fetch hydration data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


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


  const calculateWaterIntake = () => {
    if (!profile) return 0;

    const age = passedAge ?? calculateAge(profile.dob);

    let waterMl = profile.weight_kg * 35;

    if (age > 45) waterMl -= 300;
    if (age < 18) waterMl -= 500;
    if (profile.gender === "male") waterMl += 250;

    return Math.max(waterMl, 1500);
  };

  
  const generateSchedule = (glasses: number) => {
    const startHour = 6.5;  
    const endHour = 21.5;   

    const interval = (endHour - startHour) / glasses;
    const times: string[] = [];

    for (let i = 0; i < glasses; i++) {
      const time = startHour + interval * i;

      const hours = Math.floor(time);
      const minutes = Math.round((time - hours) * 60);

      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHour = hours % 12 === 0 ? 12 : hours % 12;

      times.push(
        `${displayHour}:${minutes.toString().padStart(2, "0")} ${ampm}`
      );
    }

    return times;
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;

  if (
    !profile?.dob ||
    !profile?.weight_kg ||
    !profile?.gender 
  ) {

    return (
            <ProfileIncomplete
              title="Profile Incomplete"
              message="Please complete your profile to see hydration plan."
             
            />
          );
    
  }

  if (error) return <p className="hydrate-error">{error}</p>;
  if (!profile) return null;

  const totalWater = calculateWaterIntake();
  const glasses = Math.round(totalWater / 250);

  const schedule = generateSchedule(glasses);

  return (
    <div className="hydrate-page">

       <Link to="/dashboard"
      ><button className="backDB">← Back To Dashboard</button></Link>
      <h2 className="hydrate-title"> Your Daily Hydration Plan</h2>

      <div className="hydrate-summary">
        <p>Based on your body details, you should drink approximately:</p>
        <h3>{(totalWater / 1000).toFixed(1)} Liters / day</h3>
        <span>({glasses} glasses of water)</span>
      </div>

      <div className="hydrate-schedule">
        <h3> Water Intake Schedule</h3>
        <ul>
          {schedule.map((time, index) => (
            <li key={index}>
              <strong>{time}:</strong> 1 glass
            </li>
          ))}
        </ul>

        <p className="hydrate-note">
           Sip slowly. Avoid drinking large amounts right before sleep.
        </p>
      </div>

      <div className="hydrate-rules">
  <h3> Smart Hydration Rules</h3>
  <ul>
    <li>Start your day with one glass of water after waking up.</li>
    <li>Drink water 30 minutes before meals for better digestion.</li>
    <li>Sip water slowly — avoid drinking a full glass at once.</li>
    <li>Increase intake if you exercise or sweat a lot.</li>
    <li>Reduce water intake 1 hour before sleep.</li>
    <li>Avoid drinking water immediately after meals.</li>
    <li>Avoid replacing water with sugary drinks or soda.</li>
  </ul>
</div>

    </div>
  );
}
