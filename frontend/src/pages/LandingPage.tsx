import Navbar from "../components/Navbar";
import "../styles/LandingPage.css";
import { Link } from "react-router-dom";
import Footer from '../components/Footer';

const Landing = () => {
  const userName = "John";

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-container">
          <h2 className="hero-title">
            Your Personal Health <span>Lifemate</span>
          </h2>
          <p className="hero-subtitle">
            Get personalized diet plans, daily habits, and future health predictions based on your body stats — in minutes.
          </p>

          <Link  to="/signin"
          className="flex items-center gap-2 no-underline h-full">
            <button className="btn-primary">Start Today →</button>
          </Link>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section about">
        <div className="section-container">
          <h2 className="section-title">About Lifemate</h2>
          <p className="section-text">
            Lifemate is a smart, personalized health companion designed to help you understand, improve, and sustain a healthier lifestyle. By analyzing your body metrics, daily habits, and lifestyle patterns, Lifemate provides tailored diet suggestions, habit recommendations, and future health insights. Instead of generic advice, Lifemate focuses on small, practical changes that fit naturally into your daily routine—empowering you to make informed decisions, prevent health issues early, and build long-term well-being through consistency and awareness.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section features">
        <div className="section-container">
          <h2 className="section-title">Features</h2>

          <div className="feature-grid">
            <div className="feature-card">🥗 Personalized Diet Plans</div>
            <div className="feature-card">📊 Daily Habit Tracking</div>
            <div className="feature-card">🔮 Future Health Predictions</div>
            <div className="feature-card">🧠 Smart Lifestyle Insights</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section how-it-works">
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>

          <div className="steps">
            <div className="step">
              <span>1</span>
              <p>Enter your body details and health goals</p>
            </div>
            <div className="step">
              <span>2</span>
              <p>Track daily habits and lifestyle activities</p>
            </div>
            <div className="step">
              <span>3</span>
              <p>Receive AI-powered insights and predictions</p>
            </div>
            <div className="step">
              <span>4</span>
              <p>Improve your health with small daily changes</p>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="preview">
        <div className="preview-container">
          <div className="card">
            <div className="card-header">
              <h3>Hello, {userName}!</h3>
              <span className="badge">28 • Male</span>
            </div>

            <div className="stats">
              <div className="stat"><strong>178 cm</strong><p>Height</p></div>
              <div className="stat"><strong>75 kg</strong><p>Weight</p></div>
              <div className="stat"><strong>23.7 ✓</strong><p>BMI</p></div>
            </div>

            <div className="insights">
              <div>
                <h4>Your Current Insights</h4>
                <div className="tags">
                  <span className="tag-orange">Hair Fall</span>
                  <span className="tag-red">Acne</span>
                  <span className="tag-yellow">Low Energy</span>
                </div>

                <h5>Daily Habit Recommendations</h5>
                <div className="habits">
                  <div className="habit">🥗 Balanced Diet</div>
                  <div className="habit">💧 Hydrate More</div>
                  <div className="habit">🧴 Scalp Care</div>
                  <div className="habit">🏃‍♂️ Exercise</div>
                </div>
              </div>

              <div className="prediction">
                <h4>What Happens Next?</h4>
                <div className="prediction-box">
                  <div className="good">
                    <h5>Good Habits</h5>
                    <p>Healthy weight, more energy</p>
                  </div>
                  <div className="bad">
                    <h5>Bad Habits</h5>
                    <p>Fatigue, weight gain</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h3>Ready to Meet Your Healthier Self?</h3>
        <p className="pb-5">No diets. No guesswork. Just guidance.</p>
        <br />
       <Link to="/signin"
          className="flex items-center gap-2 no-underline h-full">
          <button className="btn-primary">Create Your Lifemate Plan →</button>

    </Link>
      </section>

      <Footer/>
    </>
  );
};

export default Landing;



