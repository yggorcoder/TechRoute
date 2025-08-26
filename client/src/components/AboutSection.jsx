import React from 'react';

function AboutSection() {
  return (
    <section id="about" className="py-5 bg-dark text-white">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold">Why Choose TechRoute?</h2>
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="feature-icon mb-3">
              <i className="bi bi-shield-check"></i>
            </div>
            <h4 className="fw-semibold">Reliable Tracking</h4>
            <p className="text-white-50">Ensure every technical visit is properly tracked with accurate time stamps and location data.</p>
          </div>
          <div className="col-md-4">
            <div className="feature-icon mb-3">
              <i className="bi bi-speedometer2"></i>
            </div>
            <h4 className="fw-semibold">Efficient Management</h4>
            <p className="text-white-50">Streamline your workflow with automated status updates and intelligent scheduling system.</p>
          </div>
          <div className="col-md-4">
            <div className="feature-icon mb-3">
              <i className="bi bi-bar-chart-line"></i>
            </div>
            <h4 className="fw-semibold">Insightful Analytics</h4>
            <p className="text-white-50">Get detailed insights and weekly performance reports to improve your technical visit operations.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;