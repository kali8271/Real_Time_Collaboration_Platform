import React from "react";

const Privacy = () => (
  <div style={{ maxWidth: 700, margin: "2rem auto", padding: 32, background: "var(--card-bg)", borderRadius: 12, boxShadow: "0 2px 12px #eee" }}>
    <h2>Privacy Policy</h2>
    <p style={{ fontSize: 17, color: '#555' }}>
      We value your privacy. Your data is stored securely and is never shared with third parties except as required by law.<br /><br />
      <b>What we collect:</b> User account info, documents, chat messages, whiteboard data, and activity logs.<br /><br />
      <b>How we use it:</b> To provide and improve our collaboration services.<br /><br />
      <b>Your rights:</b> You can request deletion of your account and data at any time.<br /><br />
      For more details, contact us at <a href="mailto:support@collabplatform.com">support@collabplatform.com</a>.
    </p>
  </div>
);

export default Privacy; 