import { useState } from "react";
import "./App.css";

function App() {
  return (
    <>
      <div className="eyecatcher">
        <h1>WELCOME!</h1>

        <img
          src="./src/assets/puzzle.png"
          className="icon"
          alt="puzzle icon from flaticon in animation"
        />
      </div>
      <div className="registerForm">
        <p className="title">LOGIN</p>

        <form className="App">
          <input type="text" value="Username" />
          <input type="email" value="Email" />
          <input type="password" value="Password" />
          <button onClick="submit" style={{ backgroundColor: "#16E2F5" }}>
            Submit
          </button>
        </form>
      </div>
      <div className="card">
        <p>You don't have an account yet?! Please click here:</p>
        <button onClick="SignUp"> Sign Up here</button>
      </div>

      <a
        href="https://www.flaticon.com/free-animated-icons/puzzle"
        title="puzzle animated icons"
      >
        Puzzle animated icons created by Freepik - Flaticon
      </a>
    </>
  );
}

export default App;
