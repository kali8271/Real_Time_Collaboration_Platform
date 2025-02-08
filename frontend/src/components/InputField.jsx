import React from "react";

const InputField = ({ placeholder, value, onChange }) => {
  return <input className="border p-2 rounded w-full" placeholder={placeholder} value={value} onChange={onChange} />;
};

export default InputField;
