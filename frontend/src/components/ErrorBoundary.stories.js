import React from 'react';
import ErrorBoundary from './ErrorBoundary';

export default {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
};

// Component that throws an error
const BuggyComponent = () => {
  throw new Error('This is a test error!');
};

// Component that works fine
const WorkingComponent = () => (
  <div className="p-8 text-center">
    <h2 className="text-xl font-bold text-green-600">Everything is working!</h2>
    <p className="text-gray-600 mt-2">This component rendered successfully.</p>
  </div>
);

export const WithError = () => (
  <ErrorBoundary>
    <BuggyComponent />
  </ErrorBoundary>
);
WithError.parameters = {
  docs: {
    description: {
      story: 'Shows the error UI when a child component throws an error.'
    }
  }
};

export const WithoutError = () => (
  <ErrorBoundary>
    <WorkingComponent />
  </ErrorBoundary>
);
WithoutError.parameters = {
  docs: {
    description: {
      story: 'Shows normal content when no error occurs.'
    }
  }
};

export const CustomFallback = () => (
  <ErrorBoundary
    fallback={
      <div className="p-8 text-center bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-600">Custom Error View</h2>
        <p className="text-gray-600 mt-2">This is a custom fallback UI.</p>
      </div>
    }
  >
    <BuggyComponent />
  </ErrorBoundary>
);
CustomFallback.parameters = {
  docs: {
    description: {
      story: 'Shows a custom fallback UI when an error occurs.'
    }
  }
};
