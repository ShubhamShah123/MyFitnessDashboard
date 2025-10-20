import { useState, useEffect } from "react";
import "./navbar.scss";
import { getStreakCounterUrl } from "../../url";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['key'])
  useEffect(() => {
    const getStreakCounter = async () => {
      setStreakCount(25);
      const getStreakCounterRequest = await fetch(getStreakCounterUrl);
      const getSteakCounterResponse = await getStreakCounterRequest.json();
      console.log("Response steak from api: ", getSteakCounterResponse);
      setStreakCount(getSteakCounterResponse.counter);
    };

    getStreakCounter();
  }, []);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const showUserProfile = () => {
    console.log("showUserProfile function")
    navigate(`/dashboard/profile`);
  }

  const logout = () => {
    console.log("Logout Function.")
    removeCookie('key');
    navigate(`/login`,{replace: true});
  }

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-section')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  return (
    <div className="navbar">
      <div className="logo">
        <div className="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5C14.8 4.1 13.6 3 12.1 3C10.6 3 9.4 4.1 9.2 5.5L3 7V9L9.2 7.5C9.2 7.5 9.2 7.5 9.2 7.5L10.2 12L8 13V22H10V14.5L12 13.5L14 14.5V22H16V13L13.8 12L14.8 7.5C14.8 7.5 14.8 7.5 14.8 7.5L21 9Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span>Workout Tracker</span>
      </div>
      
      <div className="icons">
        {/* Streak Counter */}
        <div className="streak-display">
          <span className="streak-text">{streakCount} days streak</span>
          <span className="fire-icon">🔥</span>
        </div>

        {/* Notifications */}
        {/* Settings Icon with Streak Tooltip */}
        {/* User Section with Dropdown */}
        <div className="user-section">
          <div className="user" onClick={toggleUserMenu}>
            <img
              src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
              alt="Profile"
            />
            <span>Shubham Shah</span>
            <svg
              className={`dropdown-arrow ${showUserMenu ? "rotated" : ""}`}
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {showUserMenu && (
            <div className="user-dropdown">
              <div
                className="dropdown-item"
                onClick={() => showUserProfile()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"
                    fill="currentColor"
                  />
                </svg>
                Profile
              </div>
              <div
                className="dropdown-item logout"
                onClick={() => logout()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 17L21 12L16 7M21 12H9M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;