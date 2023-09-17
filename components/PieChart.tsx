import React from "react";

type PieChartProps = {
  ratio: number; // Should be between 0 and 100
};

const PieChart: React.FC<PieChartProps> = ({ ratio }) => {
  const circumference = 100;

  const offset = ((100 - ratio) / 100) * circumference;

  return (
    <svg width="50" height="50" viewBox="0 0 42 42">
      <circle
        cx="21"
        cy="21"
        r="15.91549430918954"
        fill="transparent"
        stroke="#e6e6e6"
        strokeWidth="8"
      ></circle>

      <circle
        cx="21"
        cy="21"
        r="15.91549430918954"
        fill="transparent"
        stroke="#00f"
        strokeWidth="8"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
      ></circle>
    </svg>
  );
};

export default PieChart;
