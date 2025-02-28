import React from "react";
import GridStackComponent from "./components/GridStackComponent";
import ChartWidget from "./components/ChartWidget";

const sampleData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const App: React.FC = () => {
  return (
    <div>
      <h1>My GridStack App</h1>
      <GridStackComponent />
      <ChartWidget
        data={sampleData}
        title="Browser Usage"
        description="Distribution of browser usage"
      />
    </div>
  );
};

export default App;
