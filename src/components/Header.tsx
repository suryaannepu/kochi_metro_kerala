import React from 'react';
import { Train, MapPin } from 'lucide-react';

interface HeaderProps {
  onGenerateData: () => void;
  isGenerating: boolean;
}

export default function Header({ onGenerateData, isGenerating }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-full">
              <Train className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Kochi Metro</h1>
              <p className="text-blue-100">Train Scheduling & Induction Planner</p>
            </div>
          </div>
          
          <button
            onClick={onGenerateData}
            disabled={isGenerating}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isGenerating ? 'Generating...' : 'Generate Data'}
          </button>
        </div>
        
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-5 w-5" />
            <span className="font-medium">About Kochi Metro</span>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed">
            The Kochi Metro is a rapid transit system serving the city of Kochi in Kerala, India. 
            This intelligent scheduling system uses AI-driven risk assessment and multi-criteria decision analysis 
            to optimize train operations, maintenance planning, and depot bay allocation for enhanced passenger service.
          </p>
        </div>
      </div>
    </header>
  );
}