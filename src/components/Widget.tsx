import React from "react";

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

export default Widget;
