export const saveLayoutToLocalStorage = (layout: any, widgetIds: number[]) => {
  const savedData = {
    layout,
    widgetIds,
  };
  localStorage.setItem("grid-layout", JSON.stringify(savedData));
};

export const loadLayoutFromLocalStorage = () => {
  const savedData = localStorage.getItem("grid-layout");
  return savedData ? JSON.parse(savedData) : null;
};
