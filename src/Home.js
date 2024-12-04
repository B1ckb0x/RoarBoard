import React from "react";
import { Link } from "react-router-dom"; // Import the Link component

function Home() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px 20px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "#343a40",
          color: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>
          Welcome to RoarBoard!
        </h1>
        <p style={{ fontSize: "1.5rem", margin: "10px 0" }}>
          Explore our Clubs, Calendar, and Doc the AI for more insights.
        </p>
      </div>

      {/* Add the image */}
      <img
        src="/RoarBoardLogo.png" // Replace with your actual image filename
        alt="RoarBoard Banner"
        style={{
          maxWidth: "100%",
          height: "auto",
          marginTop: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      />

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          textAlign: "left",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>About RoarBoard</h2>
        <p style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>
          RoarBoard is your central hub for all things happening in our
          community. Whether you're interested in joining a club, keeping track
          of events in the calendar, or interacting with Doc the AI, we have
          something for everyone. Stay tuned for more updates and features!
        </p>
        <p style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>
          If you're new here, feel free to{" "}
          <Link
            to="/register"
            style={{
              color: "white",
              textDecoration: "none",
              backgroundColor: "#007bff",
              padding: "5px 10px",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            register
          </Link>{" "}
          your account to make the most of our resources. We're excited to have
          you on board!
        </p>
      </div>
    </div>
  );
}

export default Home;
