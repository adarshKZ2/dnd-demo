import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client"; // For React 18+
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";

// Updated Widget Component with remove button
const Widget = ({ id, onRemove }: { id: number; onRemove: () => void }) => {
  return (
    <div className="grid-stack-item-content relative">
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent event bubbling
          onRemove();
        }}
        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
      >
        ×
      </button>
      <h3>Widget {id}</h3>
      <p>Resizable & Draggable</p>
    </div>
  );
};

const GridStackComponent: React.FC = () => {
  const gridRef = useRef<GridStack | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Track widgets with their DOM elements
  const widgetsRef = useRef<Map<number, HTMLElement>>(new Map());

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

  // Function to remove a widget
  const removeWidget = (id: number) => {
    if (gridRef.current && widgetsRef.current.has(id)) {
      const widget = widgetsRef.current.get(id)!;
      gridRef.current.removeWidget(widget);
      widgetsRef.current.delete(id);
    }
  };

  // Function to add a new React widget
  const addWidget = () => {
    const newId = Date.now();

    const newDiv = document.createElement("div");
    newDiv.id = `widget-${newId}`;
    newDiv.className = "grid-stack-item";
    newDiv.setAttribute("gs-w", "4");
    newDiv.setAttribute("gs-h", "4");

    const innerDiv = document.createElement("div");
    innerDiv.className = "grid-stack-item-content";
    newDiv.appendChild(innerDiv);

    containerRef.current!.appendChild(newDiv);

    // Store reference to widget element
    widgetsRef.current.set(newId, newDiv);

    // Pass remove handler to the widget
    const root = createRoot(innerDiv);
    root.render(<Widget id={newId} onRemove={() => removeWidget(newId)} />);

    // Convert it into a GridStack widget (makes it draggable & resizable)
    gridRef.current!.makeWidget(newDiv);
  };

  return (
    <div>
      <button
        onClick={addWidget}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4 hover:bg-blue-600"
      >
        Add Widget
      </button>
      <div
        ref={containerRef}
        className="grid-stack bg-slate-100 p-4 rounded-lg border border-gray-200 shadow-md min-h-[500px] w-full"
      ></div>
    </div>
  );
};

export default GridStackComponent;
