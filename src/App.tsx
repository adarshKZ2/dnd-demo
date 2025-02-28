import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client"; // For React 18+
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";

// React Widget Component
const Widget = ({ id }: { id: number }) => {
  return (
    <div className="grid-stack-item-content">
      <h3>Widget {id}</h3>
      <p>Resizable & Draggable</p>
    </div>
  );
};

const GridStackComponent: React.FC = () => {
  const gridRef = useRef<GridStack | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetsRef = useRef<number[]>([]); // Stores widget IDs without triggering re-renders

  // Initialize GridStack once
  useEffect(() => {
    if (containerRef.current) {
      gridRef.current = GridStack.init(
        {
          column: 12,
          disableResize: false,
          alwaysShowResizeHandle: true,
        },
        containerRef.current
      );
    }
  }, []);

  // Function to add a new React widget
  const addWidget = () => {
    const newId = Date.now();
    widgetsRef.current.push(newId); // Store widget ID

    // Create a new widget div
    const newDiv = document.createElement("div");
    newDiv.id = `widget-${newId}`;
    newDiv.className = "grid-stack-item"; // Important for GridStack
    newDiv.setAttribute("gs-w", "4"); // Not data-gs-width
    newDiv.setAttribute("gs-h", "4"); // Not data-gs-height
    // newDiv.setAttribute("gs-auto-position", "true"); // Auto-place the widget

    // Create inner div required by GridStack
    const innerDiv = document.createElement("div");
    innerDiv.className = "grid-stack-item-content";
    newDiv.appendChild(innerDiv);

    containerRef.current!.appendChild(newDiv); // Add to GridStack container

    // Mount React component inside the new widget
    const root = createRoot(innerDiv); // React 18
    root.render(<Widget id={newId} />);

    // Convert it into a GridStack widget (makes it draggable & resizable)
    gridRef.current!.makeWidget(newDiv);
  };

  return (
    <div>
      <button onClick={addWidget}>Add Widget</button>
      <div
        ref={containerRef}
        className="grid-stack bg-slate-100 p-4 rounded-lg border border-gray-200 shadow-md min-h-[500px] w-full"
      ></div>
    </div>
  );
};

export default GridStackComponent;
