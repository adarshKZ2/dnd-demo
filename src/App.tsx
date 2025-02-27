import { useEffect, useRef, useState } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "./App.css";

function App() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridInitialized, setGridInitialized] = useState(false);

  // Store grid instance in a ref
  const gridInstanceRef = useRef<GridStack | null>(null);

  useEffect(() => {
    // Wait for DOM to be fully ready
    if (!gridRef.current) return;

    // Make sure we don't initialize twice
    if (gridInitialized) return;

    try {
      console.log("Initializing GridStack");

      // Initialize GridStack
      const grid = GridStack.init(
        {
          // Basic configuration
          column: 12,
          cellHeight: 80,
          margin: 10,
          // Allow dragging and resizing for better testing
          disableResize: false,
          disableDrag: false,
          alwaysShowResizeHandle: true,
        },
        gridRef.current
      ); // Pass the reference to init

      console.log("Grid initialized:", grid);

      // Add some widgets
      grid.addWidget({ x: 0, y: 0, w: 4, h: 2, content: "Widget 1" });
      grid.addWidget({ x: 4, y: 0, w: 4, h: 2, content: "Widget 2" });
      grid.addWidget({ x: 8, y: 0, w: 4, h: 2, content: "Widget 3" });
      grid.addWidget({ x: 0, y: 2, w: 6, h: 2, content: "Widget 4" });
      grid.addWidget({ x: 6, y: 2, w: 6, h: 2, content: "Widget 5" });

      // Set the ref when creating the grid
      gridInstanceRef.current = grid;

      setGridInitialized(true);
    } catch (error) {
      console.error("Error initializing GridStack:", error);
    }

    // Cleanup
    return () => {
      if (gridInitialized && gridInstanceRef.current) {
        console.log("Destroying GridStack");
        try {
          gridInstanceRef.current.destroy();
        } catch (e) {
          console.error("Error destroying grid:", e);
        }
      }
    };
  }, [gridInitialized]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Basic GridStack Example</h1>
      <div
        className="grid-stack bg-slate-100 p-4 rounded-lg border border-gray-200 shadow-md min-h-[500px] w-full"
        ref={gridRef}
        style={{ height: "500px" }}
      />
    </div>
  );
}

export default App;
