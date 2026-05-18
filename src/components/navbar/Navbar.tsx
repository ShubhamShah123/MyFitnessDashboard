import { useState, useEffect } from "react";
import "./navbar.scss";
import { getStreakCounterUrl, getProfiles } from "../../url";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

interface Profile {
  id: number;
  name: string;
}

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<number>(1);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const navigate = useNavigate();
  const [,, removeCookie] = useCookies(['key']);
  const [schedProfile,setSchedProfile,removeSchedProfile] = useCookies(['profile']);

  useEffect(() => {
    const getStreakAndProfile = async () => {
      setStreakCount(25);
      const getStreakCounterRequest = await fetch(getStreakCounterUrl);
      const getSteakCounterResponse = await getStreakCounterRequest.json();
      console.log("Response steak from api: ", getSteakCounterResponse);
      setStreakCount(getSteakCounterResponse.counter);
      console.log("Streak Counter Set.");

      // Getting the profile list from api
      let profReq = await fetch(getProfiles);
      let profResp = await profReq.json();
      console.log("Profile Response: ", profResp.data);

      // API returns { data: ["profile1", "profile2"], status: "Success" }
      if (profResp.data && Array.isArray(profResp.data) && profResp.data.length > 0) {
        const normalized = profResp.data.map((name: string, i: number) => ({
          id: i + 1,
          name,
        }));
        setProfiles(normalized);
        
        if(schedProfile.profile){
          setSelectedProfile(schedProfile.profile);
        }
        else{
          setSelectedProfile(1);
        }
      } else {
        setProfiles([{ id: 1, name: "Profile 1" }, { id: 2, name: "Profile 2" }]);
      }
    };

    getStreakAndProfile();
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest('.user-section')) {
        setShowUserMenu(false);
      }
      if (showProfileMenu && !target.closest('.profile-selector')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu, showProfileMenu]);

  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  const handleProfileSelect = (profileId: number) => {
    setSelectedProfile(profileId);
    console.log(profileId, "handleProfileSelect")
    setShowProfileMenu(false);
  };

  const showUserProfile = () => {
    console.log("showUserProfile function");
    navigate(`/dashboard/profile`);
  };

  const setScheduleProfile = (schedProfile: number) => {
    console.log("Set Sched Profile: ", schedProfile)
    setSchedProfile('profile', schedProfile, { path: '/',maxAge: 60 * 60 * 24 * 365 })
    alert("Profile Set.")
    navigate(`/dashboard`);
  }

  const logout = () => {
    console.log("Logout Function.");
    removeCookie('key');
    removeSchedProfile('profile')
    navigate(`/login`, { replace: true });
  };

  const activeProfile = profiles.find(p => p.id === selectedProfile);

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

        {/* ── Profile Selector ── */}
        {/* Changed: was <div className="user-section"> with a <select>.
            Now uses className="profile-selector" with a fully custom dropdown
            matching the .profile-trigger / .profile-dropdown / .profile-dropdown-item
            structure defined in navbar.scss. */}
        <div className="profile-selector">
          <div
            className={`profile-trigger ${showProfileMenu ? "open" : ""}`}
            onClick={toggleProfileMenu}
          >
            {/* Person icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"/>
              <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"/>
            </svg>

            <span className="profile-trigger-label">
              {activeProfile ? activeProfile.name : "Select Profile"}
            </span>

            <svg
              className={`dropdown-arrow ${showProfileMenu ? "rotated" : ""}`}
              width="16" height="16" viewBox="0 0 24 24" fill="none"
            >
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <button
            className="log-profile-btn"
            onClick={() => activeProfile && setScheduleProfile(activeProfile.id)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Set Profile</span>
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className={`profile-dropdown-item ${profile.id === selectedProfile ? "active" : ""}`}
                  onClick={() => handleProfileSelect(profile.id)}
                >
                  {/* Avatar: first letter of profile name */}
                  <div className="profile-avatar">
                    {profile.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>

                  <span>{profile.name}</span>

                  {/* Checkmark shown next to the currently active profile */}
                  {profile.id === selectedProfile && (
                    <svg className="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Streak Counter ── */}
        <div className="streak-display">
          <span className="streak-text">{streakCount} days streak</span>
          <span className="fire-icon">🔥</span>
        </div>

        {/* ── User Section with Dropdown ── */}
        <div className="user-section">
          <div className="user" onClick={toggleUserMenu}>
            <img
              src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
              alt="Profile"
            />
            <span>Shubham Shah</span>
            <svg
              className={`dropdown-arrow ${showUserMenu ? "rotated" : ""}`}
              width="16" height="16" viewBox="0 0 24 24" fill="none"
            >
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-item" onClick={() => showUserProfile()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                  <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
                </svg>
                Profile
              </div>
              <div className="dropdown-item logout" onClick={() => logout()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M16 17L21 12L16 7M21 12H9M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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