import { Suspense } from "react";
import { DiscoverPage } from "./discover-page";

export const metadata = {
  title: "Discover — Frame",
  description: "Search, filter, and discover films through an interactive visual explorer.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
      <DiscoverPage />
    </Suspense>
  );
}

