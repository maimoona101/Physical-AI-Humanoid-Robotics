import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";

export default function Home() {
  const chapters = [
    "Chapter 1: Introduction to Physical AI and Humanoid Robotics",
    "Chapter 2: Foundations with ROS 2 Robotics",
    "Chapter 3: Simulation with Gazebo Digital Twin",
    "Chapter 4: Advanced Simulation & Visualization with Unity",
  ];

  // Heading + Subheading + Button move container
  const contentPosition: React.CSSProperties = {
    position: "relative",
    top: 30,
    left: -170,
  };

  // Chapters move container
  const chaptersPosition: React.CSSProperties = {
    position: "relative",
    top: 100,
    left: -170,
  };

  return (
    <Layout title="Physical AI & Humanoid Robotics">
      {/* Full Black Background */}
      <div style={{ background: "#000", minHeight: "100vh", color: "white" }}>
        {/* HERO SECTION */}
        <header className={styles.heroBanner} style={{ position: "relative" }}>
          {/* ROBOT IMAGE (unchanged) */}
          <img
            src="/img/robot.png"
            alt="robot"
            style={{
              position: "absolute",
              top: "127px",
              right: "100px",
              width: "350px",
              opacity: 0.9,
            }}
          />

          {/* Heading + Subheading + Button */}
          <div style={contentPosition}>
            <div className="container">
              <h1
                className="hero__title"
                style={{ color: "#00ff59ff" }} // Heading color
              >
                Physical AI & Humanoid Robotics
              </h1>

              <p
                className={styles.hero__subtitle}
                style={{ color: "#FFFFFF" }} // Subtitle color
              >
                Learn. Create. Innovate. Lead the Future.
              </p>

              <div className={styles.buttons}>
                <Link
                  className={styles.startButton}
                  to="/intro"
                  style={{
                    backgroundColor: "#FF4500", // Button background
                    color: "#FFFFFF", // Button text color
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    display: "inline-block",
                  }}
                >
                  Start Learning 🚀
                </Link>
              </div>
            </div>
          </div>

          {/* Chapters Section */}
          <div style={chaptersPosition}>
            <div className="container">
              <h2 style={{ color: "#00FFFF" }}>Chapters</h2>{" "}
              {/* Chapters heading color */}
              <div className={styles.chaptersGrid}>
                {chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className={styles.chapterBox}
                    style={{
                      background: "#111",
                      color: "#FFFFFF", // Chapter text color
                      border: "1px solid #47fc81ff",
                      marginBottom: "10px",
                      padding: "15px",
                      borderRadius: "8px",
                    }}
                  >
                    {chapter}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Simple Footer */}
      <footer
        style={{
          backgroundColor: "var(--ifm-background-color)",
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "var(--ifm-color-emphasis-900)", // Strong contrast color for visibility
            margin: 0,
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          © {new Date().getFullYear()} Physical AI & Humanoid Robotics.{" "}
          Reference Book:{" "}
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--ifm-link-color)",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            Foundations of Robotics
          </a>
        </p>
      </footer>
    </Layout>
  );
}
