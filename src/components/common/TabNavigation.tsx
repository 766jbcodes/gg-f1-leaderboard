import React from 'react';

interface TabNavigationProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-secondary/50 p-1 rounded-full flex items-center shadow-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out
                ${isActive 
                  ? 'bg-white text-navy shadow-apple hover:shadow-apple-hover scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
