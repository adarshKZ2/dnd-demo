import { useEffect, useRef, useState } from "react";
import { GridStack, GridStackNode } from "gridstack";
import { createRoot, Root } from "react-dom/client";
import { ReactNode } from "react";
import "gridstack/dist/gridstack.min.css";
import "./App.css";
import ChartWidget from "./ChartWidget";

// Fixed function to properly handle content and resizing
function addReactWidget(
  grid: GridStack,
  component: ReactNode,
  options: Partial<GridStackNode> = {}
) {
  // First create a generic widget
  const generatedWidget = grid.addWidget({
    x: options.x || 0,
    y: options.y || 0,
    w: options.w || 4,
    h: options.h || 2,
    // Plain string for content
    content: "",
    // Ensure it's resizable
    noResize: false,
  });

  // Get the content container where we'll render React
  const contentElement = generatedWidget.querySelector(
    ".grid-stack-item-content"
  );
  if (!contentElement) return { widget: generatedWidget, root: null };

  // Create React container inside
  const reactContainer = document.createElement("div");
  reactContainer.className = "w-full h-full";
  contentElement.appendChild(reactContainer);

  // Render React component
  const root = createRoot(reactContainer);
  root.render(component);

  return { widget: generatedWidget, root };
}

function App() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridInitialized, setGridInitialized] = useState(false);
  const gridInstanceRef = useRef<GridStack | null>(null);

  // Keep track of React roots for cleanup
  const reactRootsRef = useRef<Root[]>([]);

  // Function to add a new React widget on button click
  const handleAddChartWidget = () => {
    if (gridInstanceRef.current) {
      const { root } = addReactWidget(
        gridInstanceRef.current,
        <ChartWidget />,
        { x: 0, y: 4, w: 4, h: 2 }
      );

      // Only store non-null roots
      if (root) {
        reactRootsRef.current.push(root);
      }
    }
  };

  useEffect(() => {
    if (!gridRef.current || gridInitialized) return;

    try {
      console.log("Initializing GridStack");

      const grid = GridStack.init(
        {
          column: 12,
          margin: 10,
          disableResize: false,
          alwaysShowResizeHandle: true,
        },
        gridRef.current
      );

      console.log("Grid initialized:", grid);

      // Add only regular widgets
      grid.addWidget({ x: 0, y: 0, w: 4, h: 2, content: "Widget 1" });
      grid.addWidget({ x: 4, y: 0, w: 4, h: 2, content: "Widget 2" });
      grid.addWidget({ x: 8, y: 0, w: 4, h: 2, content: "Widget 3" });

      // No React component widget added here anymore - only when button is clicked

      gridInstanceRef.current = grid;
      setGridInitialized(true);
    } catch (error) {
      console.error("Error initializing GridStack:", error);
    }

    return () => {
      reactRootsRef.current.forEach((root) => {
        try {
          root.unmount();
        } catch (e) {
          console.error("Error unmounting React root:", e);
        }
      });

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
      <h1 className="text-xl font-bold mb-4">
        GridStack with React Components
      </h1>

      <div className="mb-4">
        <button
          onClick={handleAddChartWidget}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Chart Widget
        </button>
      </div>

      <div
        className="grid-stack bg-slate-100 p-4 rounded-lg border border-gray-200 shadow-md h-[500px] w-full"
        ref={gridRef}
      />
    </div>
  );
}

export default App;
