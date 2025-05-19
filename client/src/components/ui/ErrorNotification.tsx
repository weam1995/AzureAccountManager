import { useState } from "react";

interface ErrorNotificationProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorNotification({ 
  title, 
  message, 
  onRetry 
}: ErrorNotificationProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border-l-4 border-status-error rounded-md shadow-lg p-4 max-w-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <i className="ri-error-warning-line text-status-error text-lg"></i>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-neutral-800">{title}</h3>
          <div className="mt-1 text-sm text-neutral-600">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-2">
              <button 
                className="text-sm font-medium text-msblue-primary hover:text-msblue-secondary"
                onClick={onRetry}
              >
                Retry
              </button>
            </div>
          )}
        </div>
        <div className="ml-auto pl-3">
          <button 
            className="inline-flex text-neutral-400 hover:text-neutral-500"
            onClick={() => setVisible(false)}
            aria-label="Close"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
