import { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import ImageCropper from "../components/ImageCropper";
import { getCroppedImg } from "../utils/cropImage";
import "../styles/Profile.css";

interface UserProfile {
  name: string;
  email: string;
  dob?: string;
  gender: string;
  heightCm: string;
  weightKg: string;
  avgSleepHours: string;
  avgWaterIntakeLiters: string;
  profileImageUrl: string;
  scalpType: string;
  faceSkinType: string;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "";
}

const numericFieldConfig: Record<
  string,
  { min: number; max: number; step: number }
> = {
  heightCm: { min: 50, max: 250, step: 0.1 },
  weightKg: { min: 20, max: 300, step: 0.1 },
  avgSleepHours: { min: 0, max: 24, step: 0.5 },
  avgWaterIntakeLiters: { min: 0, max: 10, step: 0.1 },
};

const numericFields = [
  "heightCm",
  "weightKg",
  "avgSleepHours",
  "avgWaterIntakeLiters",
]; 


const fieldLabels: Record<string, string> = {
  heightCm: "Height (cm)",
  weightKg: "Weight (kg)",
  avgSleepHours: "Avg Sleep (hrs)",
  avgWaterIntakeLiters: "Water Intake (L)",
};

const calculateAge = (dob?: string) => {
  if (!dob) return "—";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age.toString();
};

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [imageKey, setImageKey] = useState(Date.now());
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [savingWeight, setSavingWeight] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        navigate("/signin");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      const mappedProfile: UserProfile = {
        name: data.name,
        email: data.email,
        dob: data.dob,
        gender: data.gender || "",
        heightCm: data.height_cm?.toString() || "",
        weightKg: data.weight_kg?.toString() || "",
        avgSleepHours: data.avg_sleep_hours?.toString() || "",
        avgWaterIntakeLiters: data.avg_water_intake_liters?.toString() || "",
        profileImageUrl: data.profile_image_url || "/default-profile.jpg",
        scalpType: data.scalp_type || "",
        faceSkinType: data.skin_type || "",
        activityLevel: data.activity_level || "light",
      };

      setProfile(mappedProfile);
      setFormData(mappedProfile);
    } catch (error) {
      console.error("Error in fetchProfile:", error);
    }
  };

 const handleChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;

    const { name, value } = e.target;

    // Allow free typing for numeric fields
    if (numericFields.includes(name)) {
      // Allow empty OR valid numeric input
      if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({ ...prev!, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev!, [name]: value }));
    }
  },
  [formData]
);


const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  if (!formData) return;

  const { name, value } = e.target;

  if (!numericFields.includes(name) || value === "") return;

  const config = numericFieldConfig[name];
  let num = Number(value);

  if (num < config.min) num = config.min;
  if (num > config.max) num = config.max;

  setFormData(prev => ({ ...prev!, [name]: num.toString() }));
};

  const handleSelectImage = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size should be less than 5MB");
      return;
    }
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Please select a valid image file (JPEG, PNG,jpg, WebP)");
      return;
    }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => setCropImage(reader.result as string);
    reader.readAsDataURL(file);
  };

 const saveWeightToHistory = async (userId: string, weight: number) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    console.log("Saving weight to history:", { userId, weight, today });
    
    // Method 1: Try simple insert first
    const { error: insertError } = await supabase
      .from("weight_history")
      .insert({
        user_id: userId,
        weight_kg: weight,
        recorded_at: today
      });
    
    if (insertError) {
      console.log("Insert failed, trying upsert:", insertError);
      
      // Method 2: Try upsert with explicit conflict handling
      const { error: upsertError } = await supabase
        .from("weight_history")
        .upsert({
          user_id: userId,
          weight_kg: weight,
          recorded_at: today
        }, {
          onConflict: 'user_id,recorded_at'
        });
      
      if (upsertError) {
        console.error("Upsert also failed:", upsertError);
        
        // Method 3: Delete then insert
        await supabase
          .from("weight_history")
          .delete()
          .match({ user_id: userId, recorded_at: today });
        
        const { error: finalError } = await supabase
          .from("weight_history")
          .insert({
            user_id: userId,
            weight_kg: weight,
            recorded_at: today
          });
        
        if (finalError) {
          console.error("All methods failed:", finalError);
          return false;
        }
      }
    }
    
    console.log("Weight saved successfully to history");
    return true;
  } catch (error) {
    console.error("Error in saveWeightToHistory:", error);
    return false;
  }
};

  const uploadCroppedImage = async (blob: Blob) => {
  if (!profile || !formData) {
    setUploadError("Profile data not loaded");
    return;
  }
  setUploading(true);
  setUploadError(null);
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      setUploadError("Authentication failed. Please sign in again.");
      navigate("/signin");
      return;
    }
    const timestamp = Date.now();
    const filePath = `${user.id}-${timestamp}.jpg`;
  
    // Remove the unused uploadData variable
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, blob, {
        upsert: true,
        contentType: "image/jpeg",
      });
    
    if (uploadError) {
      setUploadError(`Upload failed: ${uploadError.message}`);
      return;
    }
    
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    const cacheBustedUrl = `${urlData.publicUrl}?t=${timestamp}`;
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ profile_image_url: cacheBustedUrl })
      .eq("id", user.id);
    if (updateError) {
      setUploadError(`Failed to update profile: ${updateError.message}`);
      return;
    }
    setProfile(prev => 
      prev ? { ...prev, profileImageUrl: cacheBustedUrl } : null
    );
    setFormData(prev => 
      prev ? { ...prev, profileImageUrl: cacheBustedUrl } : null
    );
    setImageKey(timestamp);
  } catch (error: any) {
    setUploadError(`Unexpected error: ${error.message || "Unknown error"}`);
  } finally {
    setUploading(false);
  }
};

  const handleSave = async () => {
    if (!formData) return;
    setSavingWeight(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/signin");
        return;
      }

      const oldWeight = profile?.weightKg ? Number(profile.weightKg) : null;
      const newWeight = formData.weightKg ? Number(formData.weightKg) : null;

      const updates = {
        height_cm: formData.heightCm ? Number(formData.heightCm) : null,
        weight_kg: newWeight,
        avg_sleep_hours: formData.avgSleepHours
          ? Number(formData.avgSleepHours)
          : null,
        avg_water_intake_liters: formData.avgWaterIntakeLiters
          ? Number(formData.avgWaterIntakeLiters)
          : null,
        scalp_type: formData.scalpType || null,
        skin_type: formData.faceSkinType || null,
        activity_level: formData.activityLevel || "light",
        gender: formData.gender || null,
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);
      
      if (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
        return;
      }

      // Save weight to history if changed and valid
      if (newWeight && newWeight !== oldWeight) {
        console.log("Weight changed from", oldWeight, "to", newWeight);
        const weightSaved = await saveWeightToHistory(user.id, newWeight);
        if (weightSaved) {
          console.log("Weight saved to history successfully");
          
          // Notify Progress page
          const event = new CustomEvent('weightUpdated', { 
            detail: { userId: user.id, weight: newWeight } 
          });
          window.dispatchEvent(event);
        } else {
          console.log("Failed to save weight to history");
        }
      }

      await fetchProfile();
      setIsEditing(false);
      
    } catch (error) {
      console.error("Error in handleSave:", error);
      alert("An error occurred while saving. Please try again.");
    } finally {
      setSavingWeight(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin", { replace: true });
  };

  if (!profile || !formData) {
    return <div className="empty-profile">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      {uploading && (
        <div className="uploading-overlay">
          <div className="spinner"></div>
          <p>Uploading image...</p>
        </div>
      )}
      {uploadError && (
        <div className="error-message">
          <p>{uploadError}</p>
          <button onClick={() => setUploadError(null)}>Dismiss</button>
        </div>
      )}
      {savingWeight && (
        <div className="uploading-overlay">
          <div className="spinner"></div>
          <p>Saving weight to history...</p>
        </div>
      )}

      <div className="profile-header">
        <label className="avatar-wrapper">
          <img
            src={`${profile.profileImageUrl}${
              profile.profileImageUrl.includes("?") ? "&" : "?"
            }t=${imageKey}`}
            className="avatar-img"
            alt="Profile"
            key={imageKey}
            onError={(e) => {
              e.currentTarget.src = "/default-profile.jpg";
            }}
          />
          <input
            type="file"
            hidden
            accept="image/png, image/jpeg, image/jpg, image/webp"
            disabled={uploading}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleSelectImage(e.target.files[0]);
              }
            }}
          />
          <span className="avatar-edit">
            {uploading ? "Uploading..." : "Change"}
          </span>
        </label>
        <div>
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
        </div>
        <button
          className={`edit-btn ${isEditing ? "save-btn" : "edit-mode-btn"}`}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={uploading || savingWeight}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      {cropImage && (
        <ImageCropper
          image={cropImage}
          onCancel={() => setCropImage(null)}
          onComplete={async (pixels) => {
            try {
              const blob = await getCroppedImg(cropImage, pixels);
              await uploadCroppedImage(blob);
            } catch (error: any) {
              setUploadError(`Cropping failed: ${error.message}`);
            } finally {
              setCropImage(null);
            }
          }}
        />
      )}

      <div className="profile-card">
        <h3>Personal Information</h3>
        <ProfileRow label="Age" value={calculateAge(profile.dob)} />
        <ProfileRow label="Gender" value={profile.gender} />
      </div>

      <div className="profile-card">
        <h3>Health Information</h3>
        {numericFields.map((field) => {
  const config = numericFieldConfig[field];

  return (
    <div className="profile-row" key={field}>
      <span className="profile-label">{fieldLabels[field]}</span>
      {isEditing ? (
        <input
          type="number"
          name={field}
          value={(formData as any)[field]}
          onChange={handleChange}
          onBlur={handleBlur}
          className="profile-input"
          min={config.min}
          max={config.max}
          step="any"
        />
      ) : (
        <span className="profile-value">
          {(profile as any)[field] || "—"}
        </span>
      )}
    </div>
  );
})}

        <div className="profile-row">
          <span className="profile-label">Face Skin Type</span>
          {isEditing ? (
            <select
              name="faceSkinType"
              value={formData.faceSkinType}
              onChange={handleChange}
              className="profile-input"
            >
              <option value="">Select</option>
              <option value="dry">Dry</option>
              <option value="oily">Oily</option>
              <option value="combination">Combination</option>
              <option value="normal">Normal</option>
              <option value="sensitive">Sensitive</option>
            </select>
          ) : (
            <span className="profile-value">
              {profile.faceSkinType || "—"}
            </span>
          )}
        </div>
        <div className="profile-row">
          <span className="profile-label">Scalp Type</span>
          {isEditing ? (
            <select
              name="scalpType"
              value={formData.scalpType}
              onChange={handleChange}
              className="profile-input"
            >
              <option value="">Select</option>
              <option value="dry">Dry</option>
              <option value="oily">Oily</option>
              <option value="normal">Normal</option>
              <option value="dandruff">Dandruff</option>
            </select>
          ) : (
            <span className="profile-value">
              {profile.scalpType || "—"}
            </span>
          )}
        </div>
        <div className="profile-row">
          <span className="profile-label">Activity Level</span>
          {isEditing ? (
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
              className="profile-input"
            >
              <option value="">Select</option>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
            </select>
          ) : (
            <span className="profile-value">{profile.activityLevel || "—"}</span>
          )}
        </div>
      </div>

      <div className="profile-actions">
        <button onClick={handleLogout} className="btn-danger" disabled={uploading || savingWeight}>
          Logout
        </button>
      </div>
    </div>
  );
}

const ProfileRow = ({ label, value }: { label: string; value: string }) => (
  <div className="profile-row">
    <span className="profile-label">{label}</span>
    <span className="profile-value">{value}</span>
  </div>
);