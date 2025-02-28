import React, { useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client"; // For React 18+
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import Widget from "./components/Widget";
import {
  saveLayoutToLocalStorage,
  loadLayoutFromLocalStorage,
} from "./utils/storageUtils";

const GridStackComponent: React.FC = () => {
  const gridRef = useRef<GridStack | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Track widgets with their DOM elements
  const widgetsRef = useRef<Map<number, HTMLElement>>(new Map());
  // Add a ref to track React roots
  const rootsRef = useRef<Map<number, Root>>(new Map());

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

      const savedData = loadLayoutFromLocalStorage();
      if (savedData && gridRef.current) {
        const { layout, widgetIds } = savedData;
        gridRef.current.load(layout);

        widgetIds.forEach((id: number) => {
          initializeWidget(id);
        });
      }
    }
  }, []);

  const initializeWidget = (id: number) => {
    const widgetElement = document.querySelector(`[gs-id="widget-${id}"]`);
    if (widgetElement) {
      widgetsRef.current.set(id, widgetElement as HTMLElement);
      const contentContainer = widgetElement.querySelector(
        ".grid-stack-item-content"
      );
      if (contentContainer) {
        renderWidgetContent(id, contentContainer);
      }
    }
  };

  const renderWidgetContent = (id: number, container: Element) => {
    container.innerHTML = "";
    let root;
    if (rootsRef.current.has(id)) {
      root = rootsRef.current.get(id)!;
    } else {
      root = createRoot(container);
      rootsRef.current.set(id, root);
    }
    root.render(<Widget id={id} onRemove={() => removeWidget(id)} />);
  };

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
      // Get the layout without content (which would include rendered HTML)
      const layout = gridRef.current.save(false); // false = don't include content

      // Save widget IDs separately
      const widgetIds = Array.from(widgetsRef.current.keys());

      saveLayoutToLocalStorage(layout, widgetIds);
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
