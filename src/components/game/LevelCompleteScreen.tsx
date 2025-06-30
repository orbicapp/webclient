import { Trophy } from "lucide-react";

import Button from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

export interface LevelCompleteScreenProps {
  onReturn: () => void;
}

export function LevelCompleteScreen({ onReturn }: LevelCompleteScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto text-center">
        <CardContent>
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-yellow-600 mb-2">
            Level Complete!
          </h1>
          <p className="text-gray-600 mb-6">
            You have answered all questions in this level. Redirecting to
            results...
          </p>
          <Button onClick={onReturn} variant="primary">
            Return to Course
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
