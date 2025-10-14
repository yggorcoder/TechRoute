import React from 'react';

function FeaturesSection() {
  return (
    <section id="features" className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold text-dark">Complete Technical Visit Management</h2>
        <div className="row g-4 justify-content-center">
          <div className="col-md-6 col-lg-4 d-flex align-items-stretch">
            <div className="card course-card w-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column text-center p-4">
                <i className="bi bi-calendar-plus text-primary d-block mx-auto mb-3" style={{ fontSize: '3rem' }}></i>
                <h5 className="card-title fw-bold">Visit Registration</h5>
                <p className="card-text flex-grow-1">Register and schedule new technical visits with detailed client information and visit objectives.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 d-flex align-items-stretch">
            <div className="card course-card w-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column text-center p-4">
                <i className="bi bi-clipboard-check text-success d-block mx-auto mb-3" style={{ fontSize: '3rem' }}></i>
                <h5 className="card-title fw-bold">Status Management</h5>
                <p className="card-text flex-grow-1">Track and update visit status in real-time: Scheduled, In Progress, Completed, or Cancelled.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 d-flex align-items-stretch">
            <div className="card course-card w-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column text-center p-4">
                <i className="bi bi-journal-text text-warning d-block mx-auto mb-3" style={{ fontSize: '3rem' }}></i>
                <h5 className="card-title fw-bold">Post-Visit Notes</h5>
                <p className="card-text flex-grow-1">Add detailed notes, observations, and follow-up actions after each technical visit completion.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 d-flex align-items-stretch">
            <div className="card course-card w-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column text-center p-4">
                <i className="bi bi-graph-up text-info d-block mx-auto mb-3" style={{ fontSize: '3rem' }}></i>
                <h5 className="card-title fw-bold">Weekly Dashboard</h5>
                <p className="card-text flex-grow-1">View comprehensive weekly analytics and performance metrics for all your technical visits.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 d-flex align-items-stretch">
            <div className="card course-card w-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column text-center p-4">
                <i className="bi bi-file-earmark-pdf text-secondary d-block mx-auto mb-3" style={{ fontSize: '3rem' }}></i>
                <h5 className="card-title fw-bold">Report Generation</h5>
                <p className="card-text flex-grow-1">Generate detailed reports and export visit data for management review and client documentation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
