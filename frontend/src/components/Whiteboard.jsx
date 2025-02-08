import React, { useRef, useEffect } from "react";

const Whiteboard = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 500;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return <canvas ref={canvasRef} className="border shadow-lg" />;
};

export default Whiteboard;
