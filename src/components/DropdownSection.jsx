const DropdownSection = ({ title, open, onToggle, children }) => (
  <div className="bg-white rounded shadow mb-4">
    <div
      className="flex items-center justify-between px-6 py-4 cursor-pointer"
      onClick={onToggle}
    >
      <span className="font-bold text-lg">{title}</span>
      <span>
        <svg
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </span>
    </div>
    {open && <div className="px-6 pb-4">{children}</div>}
  </div>
);
export default DropdownSection;
