const PageButton: React.FC<{
  page: number;
  active?: boolean;
  onClick: (p: number) => void;
}> = ({ page, active, onClick }) => (
  <button
    onClick={() => onClick(page)}
    aria-current={active ? "page" : undefined}
    className={`px-3 py-1 rounded-md text-sm ${
      active
        ? "bg-primary text-white"
        : "bg-card border border-border/30 hover:bg-accent/10"
    }`}
  >
    {page}
  </button>
);

export default PageButton;
