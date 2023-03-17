import React from "react";

const Button = ({ onClick, title = "", disabled = false }) => {
  return (
    <button
      disabled={disabled}
      className={`button${disabled ? " !bg-gray-500 !cursor-not-allowed" : ""}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
