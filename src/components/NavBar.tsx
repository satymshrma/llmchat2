import React from "react";
import Link from "next/link";

const navStyle = "p-4 flex w-screen justify-between items-center";
const buttonContainerStyle = "items-start";
const navButtonStyle = "opacity-100 hover:opacity-50 rounded p-1 px-2";

const loginStatus = true; //TODO:get login status from local storage

// HANDLER FUNCTIONS

const loginButtonClickHandler = () => {
  console.log("login button clicked");
  //TODO: Pop up login window
};

const NavBar = () => {
  return (
    <nav className={navStyle}>
      {/* logo */}
      <Link href="/">
        <h1 className="text-2xl font-bold">LLMChat</h1>
      </Link>

      {/* nav buttons */}
      <div className={buttonContainerStyle}>
        {/* if loginstatus false */}

        {!loginStatus && (
          <>
            <button
              className={navButtonStyle + " bg-white text-black"}
              onClick={loginButtonClickHandler}
            >
              Login
            </button>
            <Link href="/signup">
              <button className={navButtonStyle + " bg-blue-700 text-white"}>
                Sign Up
              </button>
            </Link>
          </>
        )}

        {/* if loginstatus true */}

        {loginStatus && (
          <Link href="/chat">
            <button
              className={navButtonStyle + " bg-white text-black font-bold"}
            >
              <p>Chat</p>
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
