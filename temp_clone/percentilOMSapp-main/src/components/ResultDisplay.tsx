import React from 'react';

interface ResultDisplayProps {
  result: string;
}

export const ResultDisplay = ({ result }: ResultDisplayProps) => {
  if (!result) return null;
  
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-800 font-semibold text-center">
      {result}
    </div>
  );
};