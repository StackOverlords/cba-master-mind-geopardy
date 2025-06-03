
interface ModeSelectionButtonProps {
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  icon: string;
}

const ModeSelectionButton: React.FC<ModeSelectionButtonProps> = ({
  label, description, isSelected, onClick, icon
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
        isSelected
          ? 'border-dashboard-border/70 bg-dashboard-bg/70'
          : 'border-dashboard-border/50 hover:border-dashboard-border/80 hover:bg-dashboard-bg/70 bg-dashboard-bg/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold text-lg ${
              isSelected ? 'text-blue-900' : 'text-white'
            }`}>
              {label}
            </h3>
            {isSelected && (
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          <p className={`text-sm mt-1 ${
            isSelected ? 'text-blue-700' : 'text-slate-400'
          }`}>
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

export default ModeSelectionButton;