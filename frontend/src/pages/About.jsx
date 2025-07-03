import React from "react";

const About = () => (
  <div style={{ maxWidth: 700, margin: "2rem auto", padding: 32, background: "var(--card-bg)", borderRadius: 12, boxShadow: "0 2px 12px #eee" }}>
    <h2>About</h2>
    <p style={{ fontSize: 17, color: '#555' }}>
      <b>Real-Time Collaboration Platform</b> is a modern web application for teams and individuals to collaborate, chat, and create in real time.<br /><br />
      Features include:
      <ul style={{ margin: '1em 0 1em 2em', color: '#555' }}>
        <li>Real-time chat and messaging</li>
        <li>Collaborative document editing</li>
        <li>Interactive whiteboard</li>
        <li>Role-based dashboards for admins and users</li>
        <li>Activity feed and notifications</li>
        <li>Modern, responsive, and accessible design</li>
      </ul>
      <br />
      Built with Django, React, and modern web technologies.
    </p>
  </div>
);

export default About; 