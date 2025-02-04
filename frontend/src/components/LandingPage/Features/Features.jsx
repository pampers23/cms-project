import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <section className="features-section">
      <div className="features-container">
        <div className="feature">
          <h2 className="feature-title">Write Engaging Content</h2>
          <p className="feature-description">
            After drafting, take time to revise your work. Focus on clarity, coherence, and conciseness. Check for grammatical errors and ensure adherence to the publication's guidelines.
          </p>
        </div>
        <div className="feature">
          <h2 className="feature-title">Revise and Edit</h2>
          <p className="feature-description">
            After drafting, take time to revise your work. Focus on clarity, coherence, and conciseness. Check for grammatical errors and ensure adherence to the publication's guidelines.
          </p>
        </div>
        <div className="feature">
          <h2 className="feature-title">Finalize and Submit</h2>
          <p className="feature-description">
            Once satisfied with your article, prepare it for submission. Ensure it aligns with the specific requirements of the publication or platform you're targeting.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
