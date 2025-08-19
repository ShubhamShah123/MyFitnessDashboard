import "./navbar.scss"

const Navbar = () => {
  const notif_count: int = 2;
  return (
    <div className="navbar">
      <div className="logo">
        <img src="./logo.svg" alt=""  />
        <span>Workout Tracker</span>
      </div>
      <div className="icons">
        <img src="./search.svg" alt="" className="icon" />
        <img src="./app.svg" alt="" className="icon" />
        <img src="./expand.svg" alt="" className="icon" />
        <div className="notification">
          <img src="./notifications.svg" alt="" />
          <span>{notif_count}</span>
        </div>
        <div className="user">
          <img src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load" alt="" />
          <span>Shubham Shah</span>
        </div>
        <img src="./settings.svg" alt="" className="icon" />
      </div>
    </div>
  )
}

export default Navbar