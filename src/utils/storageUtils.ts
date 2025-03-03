export const saveLayoutToLocalStorage = (
  layout: any,
  widgetInfo: { id: number; type: "chart" | "info" }[]
) => {
  const savedData = {
    layout,
    widgetInfo,
  };
  localStorage.setItem("grid-layout", JSON.stringify(savedData));
};

export const loadLayoutFromLocalStorage = () => {
  const savedData = localStorage.getItem("grid-layout");
  return savedData ? JSON.parse(savedData) : null;
};
