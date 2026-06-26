import { Suspense } from "react";
import { DiscoverPage } from "../discover/discover-page";

export const metadata = {
  title: "Explore - Frame",
  description: "Search, filter, and discover films through a visual explorer.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
      <DiscoverPage />
    </Suspense>
  );
}

