const Widget = ({
  onRemove,
  children,
}: {
  onRemove: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          console.log("onRemove clicked");
          e.stopPropagation(); // Prevent event bubbling
          onRemove();
        }}
        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
      >
        ×
      </button>
      {/* <h3>Widget {id}</h3>
        <p>Resizable & Draggable</p> */}
      {children}
    </div>
  );
};

export default Widget;
