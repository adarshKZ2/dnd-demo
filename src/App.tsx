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
          margin: 10, // Add margin between items
        },
        containerRef.current
      );

      // Load saved layout if available
      try {
        const savedLayout = localStorage.getItem("grid-layout");
        if (savedLayout && gridRef.current) {
          const parsedObject = JSON.parse(savedLayout);
          console.log(parsedObject);
          gridRef.current.load(parsedObject);
        }
      } catch (e) {
        console.error("Error loading saved layout", e);
      }
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
    if (!gridRef.current) return;

    const newId = Date.now();

    // Create the widget
    const widget = gridRef.current.addWidget({
      w: 3,
      h: 3,
      autoPosition: true,
      id: `widget-${newId}`,
    });

    // Store reference to widget element
    widgetsRef.current.set(newId, widget);

    // Get the content container (need to target .grid-stack-item-content inside the widget)
    const contentContainer = widget.querySelector(".grid-stack-item-content");

    if (contentContainer) {
      // Render React component into the content container
      const root = createRoot(contentContainer);
      root.render(<Widget id={newId} onRemove={() => removeWidget(newId)} />);
    } else {
      console.error("Content container not found in widget");
    }
  };

  // Function to save the current layout
  const saveLayout = () => {
    if (gridRef.current) {
      const layout = gridRef.current.save();
      localStorage.setItem("grid-layout", JSON.stringify(layout));
      alert("Layout saved!");
    }
  };

  return (
    <div>
      <button
        onClick={addWidget}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4 hover:bg-blue-600"
      >
        Add Widget
      </button>
      <button
        onClick={saveLayout}
        className="px-4 py-2 bg-green-500 text-white rounded mb-4 hover:bg-green-600 ml-2"
      >
        Save Layout
      </button>
      <div
        ref={containerRef}
        className="grid-stack bg-slate-100 p-4 rounded-lg border border-gray-200 shadow-md min-h-[500px] w-full"
      ></div>
    </div>
  );
};

export default GridStackComponent;
