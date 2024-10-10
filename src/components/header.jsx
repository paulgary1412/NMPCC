import React from "react";

export const Header = (props) => {
  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
              <h1>
                  GROW WITH US
                  <span></span>
                </h1>
                <p>Be part of the MSU-IIT National Multi-Purpose Cooperative and be a
                  part of our community. Grow with us as we work together for a better future!
                </p>
                <a
                  href="#features"
                  className="btn btn-custom btn-lg page-scroll"
                >
                  Become a Member
                </a>

              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
