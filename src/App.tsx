import { useEffect, useRef } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "./App.css";

function App() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    // Initialize GridStack
    const grid = GridStack.init(
      {
        // Basic configuration
        column: 12,
        cellHeight: 80,
        margin: 10,
        resizable: true,
        draggable: true,
        disableOneColumnMode: false,
      },
      gridRef.current
    );

    // Add some widgets
    grid.addWidget({ x: 0, y: 0, w: 4, h: 2, content: "Widget 1" });
    grid.addWidget({ x: 4, y: 0, w: 4, h: 2, content: "Widget 2" });
    grid.addWidget({ x: 8, y: 0, w: 4, h: 2, content: "Widget 3" });
    grid.addWidget({ x: 0, y: 2, w: 6, h: 2, content: "Widget 4" });
    grid.addWidget({ x: 6, y: 2, w: 6, h: 2, content: "Widget 5" });

    // Cleanup
    return () => grid.destroy();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Basic GridStack Example</h1>
      <div
        className="grid-stack bg-slate-100 p-4 rounded-lg border border-gray-200 shadow-md min-h-[500px]"
        ref={gridRef}
      />
    </div>
  );
}

export default App;
