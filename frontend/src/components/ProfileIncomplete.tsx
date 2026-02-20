import { NavLink } from "react-router-dom";
import "../styles/profileIncomplete.css";

interface Props {
  title: string;
  message: string;
 
}

export default function ProfileIncomplete({
  title,
  message,
  
}: Props) {
  return (
    <div className="profile-incomplete-container">
      <div className="profile-incomplete-card">
        <h2>⚠ {title}</h2>

        <p>{message}</p>

        

        <NavLink to="/dashboard/profile" className="complete-profile-btn">
          Complete Profile
        </NavLink>
      </div>
    </div>
  );
}
