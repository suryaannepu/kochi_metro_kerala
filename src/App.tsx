import React, { useState } from 'react';
import { Train } from './types/train';
import { generateTrainData } from './utils/trainDataGenerator';
import Header from './components/Header';
import TabNavigation, { TabType } from './components/TabNavigation';
import RiskPredictionTab from './components/RiskPredictionTab';
import MCDARankingTab from './components/MCDARankingTab';
import PassengerLoadTab from './components/PassengerLoadTab';
import InductionPlanTab from './components/InductionPlanTab';
import DepotMapTab from './components/DepotMapTab';
import RiskDistributionChart from './components/RiskDistributionChart';

function App() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('risk');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateData = async () => {
    setIsGenerating(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newTrains = generateTrainData();
    setTrains(newTrains);
    setIsGenerating(false);
  };

  const renderActiveTab = () => {
    if (trains.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600 mb-6">
            Generate synthetic train data to view the interactive dashboard with risk analysis, 
            MCDA ranking, passenger load charts, and depot visualization.
          </p>
          <button
            onClick={handleGenerateData}
            disabled={isGenerating}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating Data...' : 'Generate Train Data'}
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'risk':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RiskPredictionTab trains={trains} />
              </div>
              <div>
                <RiskDistributionChart trains={trains} />
              </div>
            </div>
          </div>
        );
      case 'mcda':
        return <MCDARankingTab trains={trains} />;
      case 'passengers':
        return <PassengerLoadTab trains={trains} />;
      case 'induction':
        return <InductionPlanTab trains={trains} />;
      case 'depot':
        return <DepotMapTab trains={trains} />;
      default:
        return <RiskPredictionTab trains={trains} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onGenerateData={handleGenerateData} isGenerating={isGenerating} />
      
      {trains.length > 0 && (
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      
      <main className="container mx-auto px-6 py-8">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;