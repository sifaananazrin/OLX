import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";
import OlxLogo from "../../assets/OlxLogo";
import Search from "../../assets/Search";
import Arrow from "../../assets/Arrow";
import SellButton from "../../assets/SellButton";
import SellButtonPlus from "../../assets/SellButtonPlus";
import { AuthContext, FirebaseContext } from "../../Store/Context";
function Header() {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const { firebase } = useContext(FirebaseContext);
  const logoutHandle = () => {
    firebase.auth().signOut();
    history.push("/login");
  };
  return (
    <div className="headerParentDiv">
      <div className="headerChildDiv">
        <div className="brandName" onClick={() => {
          history.push("/")
        }}>
          <OlxLogo></OlxLogo>
        </div>
        <div className="placeSearch">
          <Search></Search>
          <input type="text" />
          <Arrow></Arrow>
        </div>
        <div className="productSearch">
          <div className="input">
            <input
              type="text"
              placeholder="Find car,mobile phone and more..."
            />
          </div>
          <div className="searchAction">
            <Search color="#ffffff"></Search>
          </div>
        </div>
        <div className="language">
          <span> ENGLISH </span>
          <Arrow></Arrow>
        </div>
        <div className="loginPage">
          <div class="dropdown">
            <span class="dropbtn">
              <span>{user ? user.displayName : "Guest"}</span>
            </span>
            <div class="dropdown-content">
              {user && (
                <span className="cur" onClick={logoutHandle}>
                  Logout
                </span>
              )}
              {!user && (
                <span
                  className="cur"
                  onClick={() => {
                    history.push("/login");
                  }}
                >
                  Loign
                </span>
              )}
            </div>
          </div>
          <hr />
        </div>

        <div className="sellMenu" onClick={() => { history.push("/create") }}>
          <SellButton></SellButton>
          <div className="sellMenuContent">
            <SellButtonPlus></SellButtonPlus>
            <span>SELL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
