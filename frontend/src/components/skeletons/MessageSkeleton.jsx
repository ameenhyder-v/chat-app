const MessageSkeleton = () => {
  const items = Array(6).fill(null);
  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-4 space-y-2">
      {items.map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          <div className="skeleton h-14 w-[200px] sm:w-[240px] rounded-[18px]" />
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
