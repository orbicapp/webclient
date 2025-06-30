import { AlertTriangle } from "lucide-react";

import Badge from "@/components/ui/Badge";

interface UnsupportedQuestionProps {
  questionType: string;
}

export function UnsupportedQuestion({ questionType }: UnsupportedQuestionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Question Type Not Supported
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          This question type ({questionType}) is not yet supported in the game interface. 
          Please contact support or try a different level.
        </p>
        
        <Badge variant="warning" size="lg">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Unsupported: {questionType}
        </Badge>
      </div>
    </div>
  );
}