import React from 'react';
import { cn } from '../../utils/cn';

type TabsProps = {
  tabs: {
    id: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => {
  return (
    <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
            activeTab === tab.id
              ? 'bg-white text-black'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          )}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;