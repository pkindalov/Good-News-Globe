export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-foreground">Finding positive news...</p>
        <p className="text-sm text-muted-foreground">Analyzing articles for uplifting content</p>
      </div>
    </div>
  );
};