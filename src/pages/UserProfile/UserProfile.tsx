// UserProfile.tsx
import { useEffect, useState } from "react";
import "./user-profile.scss";
import { getProfileUrl } from "../../url";
import { useCookies } from "react-cookie";

interface UserProfileData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  sessionCount: number;
  averageTimeSession: string;

}

const UserProfile = () => {
  const [cookies] = useCookies(["key"]);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Cookies in profile: ", cookies.key);
    const getUserProfile = async () => {
      try {
        setLoading(true);
        const profileRequest = await fetch(getProfileUrl + "/" + cookies.key, {
          method: "GET"
        });
        const loginResponse = await profileRequest.json();
        console.log("response from server: ", loginResponse);
        
        if (loginResponse.data) {
          console.log("First if after the response")
          setProfileData(loginResponse.data);
        } else {
          setError("Failed to load profile data");
        }
      } catch (err) {
        setError("Error fetching profile data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [cookies.key]);

  if (loading) {
    return (
      <div className="UserProfile">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="UserProfile">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="UserProfile">
      <div className="profile-container">
        {/* <h1>User Profile</h1> */}
        
        {profileData && (
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar">
                {profileData.firstName.charAt(0).toUpperCase()}
                {profileData.lastName.charAt(0).toUpperCase()}
              </div>
              <div className="user-name">
                <h2>{profileData.firstName} {profileData.lastName}</h2>
                <p className="user-status">Active User</p>
              </div>
            </div>
            
            <div className="profile-details">
              <div className="detail-group">
                <div className="detail-item">
                  <div className="detail-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9Z"/>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <label>Total Sessions</label>
                    <span>{profileData.sessionCount}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9Z"/>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <label>Average Session Time of Session</label>
                    <span>{profileData.averageTimeSession}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-group">
                <div className="detail-item">
                  <div className="detail-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <label>Email Address</label>
                    <span>{profileData.email}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <label>Phone Number</label>
                    <span>{profileData.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="profile-actions">
              <button className="btn-primary">Edit Profile</button>
              <button className="btn-secondary">Change Password</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;