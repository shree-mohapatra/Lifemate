import { useState,useEffect } from "react";
import ProfileIncomplete from "../components/ProfileIncomplete";
import { Link } from "react-router-dom";
import "../styles/Exercise.css";
import { supabase } from "../supabaseClient";

import AbdominalCruncheGif from "../animations/Abdominal crunches.gif";
import AbdominalCruncheImg from "../animations/ABDOMINAL CRUNCHES.jpg";

import armCircleGif from "../animations/arm circles.gif";
import armCircleImg from "../animations/arm circles.png";

import BackStretchGif from "../animations/BACK STRETCHF.jpg";
import BackStretchImg from "../animations/BACK STRETCHF.jpg";

import backwardLungeGif from "../animations/BACKWARD LUNGEm.gif";
import backwardLungeImg from "../animations/BACKWARD LUNGEm.jpg";

import bentlegTwistGif from "../animations/BENT LEG TWIST.gif";
import bentlegTwistImg from "../animations/BENT LEG TWIST.gif";

import ButtocksGif from "../animations/BUTTOCKSw.gif";
import ButtocksImg from "../animations/buttocksW.jpg";

import crossArmCruncheGif from "../animations/CROSS ARM CRUNCHES.gif";
import crossArmCruncheImg from "../animations/CROSS ARM CRUNCHES.jpg";

import dumbbellGif from "../animations/Dumbbell.gif";
import dumbbelImg from "../animations/DUMBBELL.jpg";

import girlDoingYogaGif from "../animations/Girl doing yoga.gif";
import girlDoingYogaImg from "../animations/girl doing yoga.png";

import legRaises2Gif from "../animations/LEG RISING2M.gif";
import legRaises2Img from "../animations/LEG RISING2M.png";

import skippingGif from "../animations/skippingW.png";
import skippingImg from "../animations/skippingW.png";

import plankJacksGif from "../animations/PLANK JACKS.gif";
import plankJacksImg from "../animations/PLANK JACKS.jpg";

import plieSquatsGif from "../animations/PLIE SQUATS.gif";
import plieSquatsImg from "../animations/PLIE SQUATS.jpg";

import RCWLRGif from "../animations/REVERSE CRUNCHES WITH LEG RAISED.gif";
import RCWLRImg from "../animations/REVERSE CRUNCHES WITH LEG RAISED.jpg";

import sideLungesGif from "../animations/SIDE LUNGES.gif";
import sideLungesImg from "../animations/SIDE LUNGES.jpg";

import SkippingGif from "../animations/skippingW.png";
import SkippingImg from "../animations/skippingW.png";

import SASGif from "../animations/STANDING ADDUCTOR STRETCH.gif";
import SASImg from "../animations/STANDING ADDUCTOR STRETCH.jpg";

import stepUpOnChairGif from "../animations/stepup onto chair.gif";
import stepUpOnChairImg from "../animations/STEP - UP ONTO CHAIR (1).jpg";

import tricepsDipsGif from "../animations/TRICEPS DIPS.gif";
import tricepsDipsImg from "../animations/TRICEPS DIPS.jpg";

import warmUpGif from "../animations/warmupM.gif";
import warmUpImg from "../animations/warmupM.png";

import yoga2Gif from "../animations/yoga2.gif";
import yoga2Img from "../animations/yoga2.jpg";

import jumpingJackGif from "../animations/jumpingjack.gif";
import jumpingJackImg from "../animations/jumpingjack.jpeg";

import bicycleCrunchesGif from "../animations/BICYCLE CRUNCHES.gif";
import bicycleCrunchesImg from "../animations/BICYCLE CRUNCHES.jpg";

import pushUpsGif from "../animations/PUSH-UPS.gif";
import pushUpsImg from "../animations/PUSH - UPS.jpg";

import squatsGif from "../animations/SQUATSm.gif";
import squatsImg from "../animations/SQUATSM.jpg";

import wallSitImg from "../animations/Wwall sit.jpg";
import wallSitGif from "../animations/Wwall sit.jpg";

import legRaisesGif from "../animations/LEG RAISES.gif";
import legRaisesImg from "../animations/LEG RAISES.jpg";

import buttBridgeGif from "../animations/BUTT BRIDGEw.gif";
import buttBridgeImg from "../animations/BUTT BRIDGE.jpg";

import yogaGif from "../animations/yoga.gif";
import yogaImg from "../animations/yoga.jpg";

const exercises: Exercise[] = [
  // 🔹 Balanced Strength + Cardio (4)
  {
    name: "Jumping Jacks",
    gif: jumpingJackGif,
    image: jumpingJackImg,
    howTo: [
      "Stand upright with feet together",
      "Jump and spread legs apart",
      "Raise arms overhead",
      "Jump back to starting position"
    ],
    worksOn: "Full body",
    category: "Balanced Strength + Cardio"
  },
  {
    name: "Plank Jacks",
    gif: plankJacksGif,
    image: plankJacksImg,
    howTo: [
      "Start in plank position",
      "Jump feet apart and together",
      "Keep back straight",
      "Continue steadily"
    ],
    worksOn: "Core, shoulders, legs",
    category: "Balanced Strength + Cardio"
  },
  {
    name: "Squats",
    gif: squatsGif,
    image: squatsImg,
    howTo: [
      "Stand with feet shoulder-width apart",
      "Lower hips by bending knees",
      "Keep chest up",
      "Push through heels to stand"
    ],
    worksOn: "Thighs, glutes",
    category: "Balanced Strength + Cardio"
  },
  {
    name: "Push-Ups",
    gif: pushUpsGif,
    image: pushUpsImg,
    howTo: [
      "Place hands shoulder-width apart",
      "Lower chest toward the floor",
      "Keep body straight",
      "Push back up"
    ],
     worksOn: "Chest, shoulders, triceps",
    category: "Balanced Strength + Cardio"
  },

  // 🔹 Low-Impact Mixed (walking + light strength) (4)
  {
    name: "Step Up On Chair",
    gif: stepUpOnChairGif,
    image: stepUpOnChairImg,
    howTo: [
      "Stand in front of a chair",
      "Step up with one foot",
      "Bring other foot up",
      "Step down carefully"
    ],
    worksOn: "Legs, glutes",
    category: "Low-Impact Mixed (walking + light strength)"
  },
  {
    name: "Wall Sit",
    gif: wallSitGif,
    image: wallSitImg,
    howTo: [
      "Stand with back against wall",
      "Slide down until knees form 90°",
      "Keep back flat",
      "Hold position"
    ],
    worksOn: "Thighs, glutes",
    category: "Low-Impact Mixed (walking + light strength)"
  },
  {
    name: "Butt Bridge",
    gif: buttBridgeGif,
    image: buttBridgeImg,
    howTo: [
      "Lie on back with knees bent",
      "Lift hips upward",
      "Squeeze glutes",
      "Lower slowly"
    ],
    worksOn: "Glutes, lower back",
    category: "Low-Impact Mixed (walking + light strength)"
  },
  {
    name: "Arm Circles",
    gif: armCircleGif,
    image: armCircleImg,
    howTo: [
      "Stand straight with arms extended",
      "Rotate arms forward",
      "Rotate arms backward",
      "Keep movements controlled"
    ],
    worksOn: "Shoulders",
    category: "Low-Impact Mixed (walking + light strength)"
  },

  // 🔹 Cardio (Weight Loss focus) (4)
  {
    name: "Skipping",
    gif: SkippingGif,
    image: SkippingImg,
    howTo: [
      "Hold skipping rope",
      "Jump lightly on toes",
      "Swing rope using wrists",
      "Maintain steady pace"
    ],
    worksOn: "Full body",
    category: "Cardio (Weight Loss focus)"
  },
  {
    name: "Warm Up",
    gif: warmUpGif,
    image: warmUpImg,
    howTo: [
      "Move arms and legs gently",
      "Increase heart rate slightly",
      "Loosen joints",
      "Prepare body"
    ],
    worksOn: "Full body",
    category: "Cardio (Weight Loss focus)"
  },
  {
    name: "Side Lunges",
    gif: sideLungesGif,
    image: sideLungesImg,
    howTo: [
      "Stand straight",
      "Step sideways",
      "Bend one knee",
      "Return and switch sides"
    ],
    worksOn: "Legs, glutes",
    category: "Cardio (Weight Loss focus)"
  },
  {
    name: "Backward Lunge",
    gif: backwardLungeGif,
    image: backwardLungeImg,
    howTo: [
      "Stand upright",
      "Step one leg backward",
      "Lower hips",
      "Return to standing"
    ],
    worksOn: "Legs, glutes",
    category: "Cardio (Weight Loss focus)"
  },

  // 🔹 Yoga / Recovery / Mobility (4)
  {
    name: "Tree Pose",
    gif: girlDoingYogaGif,
    image: girlDoingYogaImg,
    howTo: [
      "Stand straight on one leg",
      "Place other foot on inner thigh",
      "Bring hands together",
      "Maintain balance"
    ],
    worksOn: "Balance, legs",
    category: "Yoga / Recovery / Mobility"
  },
  {
    name: "Back Stretch",
    gif: BackStretchGif,
    image: BackStretchImg,
    howTo: [
      "Stretch arms forward",
      "Round back gently",
      "Hold for few seconds"
    ],
    worksOn: "Lower back",
    category: "Yoga / Recovery / Mobility"
  },
  {
    name: "Buttocks Stretch",
    gif: ButtocksGif,
    image: ButtocksImg,
    howTo: [
      "Cross one leg over the other",
      "Pull knee toward chest",
      "Hold and switch sides"
    ],
    worksOn: "Glutes",
    category: "Yoga / Recovery / Mobility"
  },
  {
    name: "Yoga Stretch",
    gif: yogaGif,
    image: yogaImg,
    howTo: [
      "Move into a comfortable pose",
      "Focus on breathing",
      "Hold and relax"
    ],
    worksOn: "Flexibility",
    category: "Yoga / Recovery / Mobility"
  },

  // 🔹 Strength Training (build muscle) (4)
  {
    name: "Step Up On Chair With Dumbbells",
    gif: dumbbellGif,
    image: dumbbelImg,
    howTo: [
      "Hold dumbbells",
      "Step onto chair",
      "Bring other foot up",
      "Step down slowly"
    ],
    worksOn: "Legs, glutes",
    category: "Strength Training (build muscle)"
  },
  {
    name: "Triceps Dips",
    gif: tricepsDipsGif,
    image: tricepsDipsImg,
    howTo: [
      "Place hands on chair",
      "Lower body",
      "Push back up"
    ],
    worksOn: "Triceps",
    category: "Strength Training (build muscle)"
  },
  {
    name: "Bicycle Crunches",
    gif: bicycleCrunchesGif,
    image: bicycleCrunchesImg,
    howTo: [
      "Bring opposite elbow to knee",
      "Switch sides continuously"
    ],
    worksOn: "Abs",
    category: "Strength Training (build muscle)"
  },
  {
    name: "Leg Raises",
    gif: legRaisesGif,
    image: legRaisesImg,
    howTo: [
      "Lift legs upward",
      "Lower slowly"
    ],
    worksOn: "Lower abs",
    category: "Strength Training (build muscle)"
  },

  // 🔹 Mixed Workout (general fitness) (4)
  {
  name: "Abdominal Crunches With Hands Back",
  gif: yoga2Gif,
  image: yoga2Img,
  howTo: [
    "Lie on your back",
    "Place hands behind head",
    "Lift shoulders upward",
    "Lower slowly"
  ],
  worksOn: "Abs",
  category: "Mixed Workout (general fitness)"
}
,
  {
    name: "Bent Leg Twist",
    gif: bentlegTwistGif,
    image: bentlegTwistImg,
    howTo: [
      "Bend knees",
      "Twist legs side to side"
    ],
    worksOn: "Core",
    category: "Mixed Workout (general fitness)"
  },
  {
    name: "Cross Arm Crunch",
    gif: crossArmCruncheGif,
    image: crossArmCruncheImg,
    howTo: [
      "Cross arms",
      "Lift shoulders",
      "Lower slowly"
    ],
    worksOn: "Abs",
    category: "Mixed Workout (general fitness)"
  },
  {
    name: "Plie Squats",
    gif: plieSquatsGif,
    image: plieSquatsImg,
    howTo: [
      "Feet wide apart",
      "Lower hips",
      "Push up"
    ],
    worksOn: "Inner thighs",
    category: "Mixed Workout (general fitness)"
  },
  {
    name: "Abdominal Crunches",
    gif: AbdominalCruncheGif,
    image: AbdominalCruncheImg,
    howTo: [
      "Lift shoulders",
      "Lower slowly"
    ],
    worksOn: "Abs",
    category: "Mixed Workout (general fitness)"
  },

  // 🔹 HIIT / High Intensity (4)
  {
  name: "Fast Skipping",
  gif: skippingGif,
  image: skippingImg,
  howTo: [
    "Jump quickly",
    "Maintain high pace",
    "Land softly"
  ],
  worksOn: "Full body",
  category: "HIIT / High Intensity"
},
  {
    name: "Reverse Crunches With Leg Raised",
    gif: RCWLRGif,
    image: RCWLRImg,
    howTo: [
      "Lift hips off floor",
      "Lower slowly"
    ],
    worksOn: "Lower abs",
    category: "HIIT / High Intensity"
  },
  {
    name: "Reverse Crunches With Straight Leg Raised",
    gif: legRaises2Gif,
    image: legRaises2Img,
    howTo: [
      "Raise straight legs",
      "Lift hips",
      "Lower slowly"
    ],
    worksOn: "Core",
    category: "HIIT / High Intensity"
  },
  {
    name: "Standing Adductor Stretch (Dynamic)",
    gif: SASGif,
    image: SASImg,
    howTo: [
      "Shift weight side to side",
      "Maintain quick rhythm"
    ],
    worksOn: "Inner thighs",
    category: "HIIT / High Intensity"
  }
];


interface Exercise {
  name: string;
  gif: string;
  image: string;
  howTo: string[];
  worksOn: string;
  category: string;
}

export default function Exercise() {
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mlExercises, setMlExercises] = useState<Exercise[]>([]);
  const [ageState, setAgeState] = useState<number | null>(null);
  const [bmiState, setBmiState] = useState<number | null>(null);
  const [profile, setProfile] = useState<any>(null);

  function calculateAge(dob: string) {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  function calculateBMI(weight: number, heightCm: number) {
    const h = heightCm / 100;
    return +(weight / (h * h)).toFixed(2);
  }

  useEffect(() => {
    async function callML() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // ⭐ fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!profileData) return;

        setProfile(profileData);

        // ⭐ incomplete profile check
        if (
          !profileData.dob ||
          !profileData.weight_kg ||
          !profileData.height_cm ||
          !profileData.gender ||
          !profileData.activity_level ||
          !profileData.avg_sleep_hours ||
          !profileData.avg_water_intake_liters
        ) {
          return;
        }

        const age = calculateAge(profileData.dob);
        const bmi = calculateBMI(profileData.weight_kg, profileData.height_cm);

        setAgeState(age);
        setBmiState(bmi);

        // ⭐ call ML API
        const res = await fetch("https://lifemate-backend-d5xy.onrender.com/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            age,
            bmi,
            gender: profileData.gender,
            activity_level: profileData.activity_level,
            avg_sleep_hours: profileData.avg_sleep_hours,
            avg_water_intake_liters: profileData.avg_water_intake_liters
          })
        });

        const data = await res.json();
        const category = data.exercise?.trim();

        if (!category) return;

        // ⭐ update DB only if changed
        if (profileData.recommended_exercise !== category) {
          await supabase
            .from("profiles")
            .update({ recommended_exercise: category })
            .eq("id", user.id);
        }

        // ⭐ map exercises
        const matched = exercises.filter(
          e => e.category.trim().toLowerCase() === category.toLowerCase()
        );

        setMlExercises(matched);

      } catch (err) {
        console.log("ML error:", err);
      } finally {
        setLoading(false);
      }
    }

    callML();
  }, []);

  if (loading) return <div className="loader-container">
  <div className="loader-wrapper">
    <span className="loader-letter">G</span>
    <span className="loader-letter">e</span>
    <span className="loader-letter">n</span>
    <span className="loader-letter">e</span>
    <span className="loader-letter">r</span>
    <span className="loader-letter">a</span>
    <span className="loader-letter">t</span>
    <span className="loader-letter">i</span>
    <span className="loader-letter">n</span>
    <span className="loader-letter">g</span>
    <div className="loader"></div>
  </div>
</div>

;

  // ⭐ profile incomplete UI
  if (
    !profile ||
    !profile.dob ||
    !profile.weight_kg ||
    !profile.height_cm ||
    !profile.gender ||
    !profile.activity_level ||
    !profile.avg_sleep_hours ||
    !profile.avg_water_intake_liters
  ) {
    return (
      <ProfileIncomplete
        title="Profile Incomplete"
        message="Please complete your profile to see exercise plan."
      />
    );
  }

  return (
    <div className="exercise-page">
      <Link to="/dashboard">
        <button className="backDB">← Back To Dashboard</button>
      </Link>

      <h2>Recommended Exercises</h2>

      <p className="exercise-reason">
        Based on your BMI ({bmiState ?? "—"}) and age ({ageState ?? "—"}), this exercise
        is recommended by AI model.
      </p>

      <div className="exercise-grid">
        {mlExercises.map((ex, index) => (
          <div
           key={index}
            className="exercise-card"
             onMouseEnter={() => setHoveredIndex(index)}
             onMouseLeave={() => setHoveredIndex(null)}
             onClick={() =>
             setHoveredIndex(hoveredIndex === index ? null : index)
              }
            >

            <div className="exercise-media">
              <img
                src={hoveredIndex === index ? ex.gif : ex.image}
                alt={ex.name}
                className="exercise-gif"
              />
            </div>

            <h3>{ex.name}</h3>

            <div className="exercise-info">
              <strong>How to Perform:</strong>
              <ul>
                {ex.howTo.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>

              <div className="how_works">
                <strong>How it Works:</strong>
                <p>{ex.worksOn}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="guidance">Click on the cards to see the proper animated guidance.</div>
    </div>
  );
}