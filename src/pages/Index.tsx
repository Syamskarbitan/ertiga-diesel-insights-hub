import { useState } from 'react';
import { ModernDashboard } from '@/components/ModernDashboard';
import { BluetoothTester } from '@/components/BluetoothTester';
import { Button } from '@/components/ui/button';
import { TestTube, ArrowLeft } from 'lucide-react';

const Index = () => {
  const [showTester, setShowTester] = useState(false);

  if (showTester) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button 
              onClick={() => setShowTester(false)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <BluetoothTester />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ModernDashboard />
      
      {/* Test Mode Toggle - Hidden in production */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setShowTester(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white shadow-lg"
        >
          <TestTube className="h-4 w-4" />
          Test Mode
        </Button>
      </div>
    </div>
  );
};

export default Index;
