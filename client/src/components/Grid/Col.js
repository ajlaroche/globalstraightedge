import React from "react";

const Col = ({ size, other, children }) => (
  <div
    className={size
      .split(" ")
      .map(size => "col-lg" + size + " " + other)
      .join(" ")}
  >
    {children}
  </div>
);

export default Col;
