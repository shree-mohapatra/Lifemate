import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/Signup.css";

export default function SignUp() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { username, name, email, password, dob, gender } = formData;

    if (!username || !name || !email || !password || !dob || !gender) {
      setError("Please fill all the fields");
      return;
    }

     const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  // ✅ Age validation
  if (age < 10 || age > 100) {
    setError(
      "Enter a valid DOB, user should be greater than 10 and less than 100 years old"
    );
    return;
  }

    setLoading(true);

    try {
      // 1️⃣ Check username uniqueness
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .single();

      if (existingUser) {
        setError("Already exist, use another username");
        setLoading(false);
        return;
      }

      // 2️⃣ Create auth user
      const { data, error: authError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (authError) throw authError;
      if (!data.user) throw new Error("User not created");

      // 3️⃣ Insert profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          username,
          name,
          email,
          dob,
          gender,
        });

      if (profileError) {
        if (profileError.code === "23505") {
          setError("Already exist, use another username");
          return;
        }
        throw profileError;
      }

      navigate("/dashboard");
    } catch (err: any) {
      console.error("SIGNUP ERROR:", err);
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
       <Link to="/"
      ><button className="backHome">← Back To Home</button></Link>
      <form onSubmit={handleSubmit} noValidate className="signup-card">
        <h2 className="signup-title">Create Your Lifemate Account</h2>

        <div className="signup-grid">
          <div className="full">
            <label>Username *</label>
            <input name="username" required onChange={handleChange} />
          </div>

          <div className="full">
            <label>Full Name *</label>
            <input name="name" required onChange={handleChange} />
          </div>

          <div className="full">
            <label>Email *</label>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
            />
          </div>

          <div className="full">
            <label>Password *</label>
            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
            />
          </div>

          <div className="full">
            <label>Date of Birth *</label>
            <input
              name="dob"
              type="date"
              required
              max={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
            />
          </div>

          <div className="full">
            <label>Gender *</label>
            <select name="gender" required onChange={handleChange}>
              <option value="">Select…</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <button disabled={loading} className="signup-btn">
          {loading ? "Creating Account…" : "Sign Up"}
        </button>

        {error && <p className="form-error">{error}</p>}

        <p className="signup-footer">
          Already have an account?
          <Link to="/signin"> Sign in</Link>
        </p>
      </form>
    </div>
  );
}
