const Loader = ({ text, border }: { text: string; border: string }) => {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${border}`}></div>
        <p className="text-gray-500 animate-pulse text-sm font-medium">{text}...</p>
      </div>
    );
  };
  export default Loader
