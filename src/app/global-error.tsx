"use client";

export default function GlobalError({
  error: _error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0e0d0b",
          color: "#e8e2d9",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <p
          style={{
            fontSize: "0.625rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "#ef4444",
            marginBottom: "1.5rem",
          }}
        >
          Critical Error
        </p>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: "2.5rem",
            fontWeight: 300,
            color: "#e8d5b0",
            marginBottom: "1rem",
            lineHeight: 1,
          }}
        >
          Projection Failure
        </h1>
        <p
          style={{
            fontSize: "0.75rem",
            color: "#78716c",
            maxWidth: "20rem",
            lineHeight: 1.7,
            letterSpacing: "0.1em",
            marginBottom: "2.5rem",
          }}
        >
          A critical error occurred that interrupted the application. Please
          attempt to reload the page.
        </p>
        <button
          onClick={unstable_retry}
          style={{
            padding: "0.875rem 1.5rem",
            border: "1px solid rgba(232, 213, 176, 0.3)",
            background: "transparent",
            color: "#e8d5b0",
            fontSize: "0.75rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
