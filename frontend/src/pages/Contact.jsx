import React from "react";

const Contact = () => (
  <div style={{ maxWidth: 700, margin: "2rem auto", padding: 32, background: "var(--card-bg)", borderRadius: 12, boxShadow: "0 2px 12px #eee" }}>
    <h2>Contact</h2>
    <p style={{ fontSize: 17, color: '#555' }}>
      For support, feedback, or inquiries, please contact us at:<br /><br />
      <b>Email:</b> <a href="mailto:support@collabplatform.com">support@collabplatform.com</a><br />
      <b>Phone:</b> +1-234-567-8901
    </p>
    <div style={{ marginTop: 32, color: '#888', fontSize: 15 }}>
      (Contact form coming soon)
    </div>
  </div>
);

export default Contact; 