import React, { useState, useRef, useEffect } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useAuth } from "../../auth/hooks/useAuth.js";
import { useNavigate } from "react-router";

const Home = () => {
  const { loading, generateReport, reports } = useInterview();
  const { user, handleLogout } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-profile]")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    if (!data) return;
    navigate(`/interview/${data._id}`);
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  return (
    <div className="home-page">
      {/* Profile Avatar */}
      <div
        data-profile
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "flex-end",
          padding: "16px 24px 0",
          width: '100%'
        }}
      >
        <div
          onClick={() => setShowDropdown((o) => !o)}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "#e8195b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            fontSize: "15px",
            color: "#fff",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </div>

        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "48px",
              right: "24px",
              background: "#1a1f27",
              border: "1px solid #2a2f3a",
              borderRadius: "10px",
              padding: "8px",
              minWidth: "180px",
              zIndex: 100,
            }}
          >
            <p
              style={{
                padding: "8px 12px",
                fontSize: "13px",
                color: "#888",
                borderBottom: "1px solid #2a2f3a",
                marginBottom: "4px",
              }}
            >
              {user?.username}
            </p>
            <button
              onClick={async () => {
                await handleLogout();
                navigate("/login");
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                color: "#e8195b",
                fontSize: "13px",
                textAlign: "left",
                cursor: "pointer",
                borderRadius: "6px",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#2a2f3a")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Page Header */}
      <header className="page-header">
        <h1>
          Create Your Custom <span className="highlight">Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
      </header>

      {/* Main Card */}
      <div className="interview-card">
        <div className="interview-card__body">
          {/* Left Panel - Job Description */}
          <div className="panel panel--left">
            <div className="panel__header">
              <span className="panel__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </span>
              <h2>Target Job Description</h2>
              <span className="badge badge--required">Required</span>
            </div>
            <textarea
              onChange={(e) => setJobDescription(e.target.value)}
              className="panel__textarea"
              placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
              maxLength={5000}
            />
            <div className="char-counter">
              {jobDescription.length} / 5000 chars
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="panel-divider" />

          {/* Right Panel - Profile */}
          <div className="panel panel--right">
            <div className="panel__header">
              <span className="panel__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <h2>Your Profile</h2>
            </div>

            {/* Upload Resume */}
            <div className="upload-section">
              <label className="section-label">
                Upload Resume
                <span className="badge badge--best">Best Results</span>
              </label>
              <label className="dropzone" htmlFor="resume">
                <span className="dropzone__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="16 16 12 12 8 16" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                </span>
                <p className="dropzone__title">
                  Click to upload or drag &amp; drop
                </p>
                <p className="dropzone__subtitle"> PDF </p>
                <input
                  ref={resumeInputRef}
                  hidden
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.docx"
                  onChange={(e) => setFileName(e.target.files[0]?.name || "")}
                />
              </label>
              {fileName && (
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "13px",
                    color: "#a0e0a0",
                  }}
                >
                  ✓ {fileName}
                </p>
              )}
            </div>

            {/* OR Divider */}
            <div className="or-divider">
              <span>OR</span>
            </div>

            {/* Quick Self-Description */}
            <div className="self-description">
              <label className="section-label" htmlFor="selfDescription">
                Quick Self-Description
              </label>
              <textarea
                onChange={(e) => setSelfDescription(e.target.value)}
                id="selfDescription"
                name="selfDescription"
                className="panel__textarea panel__textarea--short"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />
            </div>

            {/* Info Box */}
            <div className="info-box">
              <span className="info-box__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line
                    x1="12"
                    y1="8"
                    x2="12"
                    y2="12"
                    stroke="#1a1f27"
                    strokeWidth="2"
                  />
                  <line
                    x1="12"
                    y1="16"
                    x2="12.01"
                    y2="16"
                    stroke="#1a1f27"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              <p>
                Either a <strong>Resume</strong> or a{" "}
                <strong>Self Description</strong> is required to generate a
                personalized plan.
              </p>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="interview-card__footer">
          <span className="footer-info">
            AI-Powered Strategy Generation &bull; Approx 30s
          </span>
          <button onClick={handleGenerateReport} className="generate-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            Generate My Interview Strategy
          </button>
        </div>
      </div>

      {/* Recent Reports List */}
      {reports.length > 0 && (
        <section className="recent-reports">
          <h2>My Recent Interview Plans</h2>
          <ul className="reports-list">
            {reports.map((report) => (
              <li
                key={report._id}
                className="report-item"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>{report.title || "Untitled Position"}</h3>
                <p className="report-meta">
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <p
                  className={`match-score ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}
                >
                  Match Score: {report.matchScore}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Page Footer */}
      <footer className="page-footer">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Help Center</a>
      </footer>
    </div>
  );
};

export default Home;
