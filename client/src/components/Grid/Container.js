import React from "react";

export const Container = ({ fluid, other, children }) => (
  <div className={`container${fluid ? "-fluid" : ""} ${other}`}>{children}</div>
);
