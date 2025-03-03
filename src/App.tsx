import React from "react";
import GridStackComponent from "./components/GridStackComponent";

const App: React.FC = () => {
  return (
    <div>
      <h1>My GridStack App</h1>
      <GridStackComponent />
      {/* <div className="mx-auto flex justify-center p-4">
        <ChartWidget
          data={sampleData}
          title="Browser Usage"
          description="Distribution of browser usage"
        />
        <InfoCard />
      </div> */}
    </div>
  );
};

export default App;
