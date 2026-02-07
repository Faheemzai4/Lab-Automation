"use client";

export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="spinner"></div>

      <style jsx>{`
        .loader-overlay {
          position: fixed;
          inset: 0;
          background: rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 5px solid #e5e7eb;
          border-top: 5px solid #111827;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
