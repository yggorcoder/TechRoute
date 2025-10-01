import React from 'react';

function Footer() {
  return (
    <footer className="py-4 bg-darker text-white">
      <div className="container text-center">
        <p className="mb-2">&copy; 2025 TechRoute. All rights reserved.</p>
        <div>
          {/* External links can use the normal <a> tag */}
          <a href="#" className="text-white-50 me-3 fs-5"><i className="bi bi-twitter-x"></i></a>
          <a href="#" className="text-white-50 me-3 fs-5"><i className="bi bi-linkedin"></i></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
