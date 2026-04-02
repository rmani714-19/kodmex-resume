import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Builder = lazy(() => import("./pages/Builder.jsx"));

function ShellFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page text-slate-500">
      Loading resume builder...
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<ShellFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/builder" replace />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/preview" element={<Navigate to="/builder" replace />} />
        <Route path="*" element={<Navigate to="/builder" replace />} />
      </Routes>
    </Suspense>
  );
}
