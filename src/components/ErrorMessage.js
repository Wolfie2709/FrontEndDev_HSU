"use client"

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message">
      <p>❌ {message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-btn">
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
