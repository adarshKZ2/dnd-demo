import React, { useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import Widget from "./Widget";

import ChartWidget from "../widgets/ChartWidget";
import InfoCard from "../widgets/InfoCard";

import {
  saveLayoutToLocalStorage,
  loadLayoutFromLocalStorage,
} from "../utils/storageUtils";

type widgetType = "chart" | "info";

interface WidgetInfo {
  type: widgetType;
  element: HTMLElement;
}

const GridStackComponent: React.FC = () => {
  const gridRef = useRef<GridStack | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetsRef = useRef<Map<number, WidgetInfo>>(new Map());
  const rootsRef = useRef<Map<number, Root>>(new Map());

  useEffect(() => {
    if (containerRef.current) {
      gridRef.current = GridStack.init(
        {
          column: 12,
          disableResize: false,
          alwaysShowResizeHandle: true,
          margin: 10,
        },
        containerRef.current
      );

      const savedData = loadLayoutFromLocalStorage();
      if (savedData && gridRef.current) {
        const { layout, widgetInfo } = savedData;
        gridRef.current.load(layout);

        widgetInfo.forEach((info: { id: number; type: widgetType }) => {
          initializeWidget(info.id, info.type);
        });
      }
    }
  }, []);

  const initializeWidget = (id: number, type: widgetType) => {
    const widgetElement = document.querySelector(`[gs-id="widget-${id}"]`);
    if (widgetElement) {
      widgetsRef.current.set(id, {
        type,
        element: widgetElement as HTMLElement,
      });
      const contentContainer = widgetElement.querySelector(
        ".grid-stack-item-content"
      );
      if (contentContainer) {
        renderWidgetContent(id, contentContainer, type);
      }
    }
  };

  const renderWidgetContent = (
    id: number,
    container: Element,
    type: widgetType
  ) => {
    container.innerHTML = "";
    let root;
    //check if the container is already react container or not
    if (rootsRef.current.has(id)) {
      root = rootsRef.current.get(id)!;
    } else {
      root = createRoot(container);
      rootsRef.current.set(id, root);
    }

    root.render(
      <Widget onRemove={() => removeWidget(id)}>
        {type === "chart" ? <ChartWidget /> : <InfoCard />}
      </Widget>
    );
  };

  const removeWidget = (id: number) => {
    console.log("removeWidget", id);
    console.log("gridRef.current", gridRef.current);
    console.log("widgetsRef.current", widgetsRef.current.get(id));
    if (gridRef.current && widgetsRef.current.has(id)) {
      const widgetInfo = widgetsRef.current.get(id)!;
      gridRef.current.removeWidget(widgetInfo.element);
      widgetsRef.current.delete(id);
    }
  };

  const addWidget = (type: "chart" | "info") => {
    if (!gridRef.current) return;

    const newId = Date.now();
    const widget = gridRef.current.addWidget({
      w: 4,
      h: 3,
      autoPosition: true,
      id: `widget-${newId}`,
    });

    widgetsRef.current.set(newId, { type, element: widget });
    const contentContainer = widget.querySelector(".grid-stack-item-content");

    renderWidgetContent(newId, contentContainer as Element, type);
  };

  const saveLayout = () => {
    if (gridRef.current) {
      const layout = gridRef.current.save(false);
      const arrayOfWidgetObjs = Array.from(widgetsRef.current.entries());
      const widgetInfo = arrayOfWidgetObjs.map(([id, widgetInfo]) => ({
        id,
        type: widgetInfo.type,
      }));
      console.log("widgetInfo", widgetInfo);
      saveLayoutToLocalStorage(layout, widgetInfo);
      alert("Layout saved!");
    }
  };

  return (
    <div>
      <button
        onClick={() => addWidget("chart")}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4 hover:bg-blue-600"
      >
        Add Chart Widget
      </button>
      <button
        onClick={() => addWidget("info")}
        className="px-4 py-2 bg-red-500 text-white rounded mb-4 hover:bg-blue-600"
      >
        Add Info Widget
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
