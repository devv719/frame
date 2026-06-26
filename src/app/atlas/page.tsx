import type { Metadata } from "next";
import { AtlasPage } from "@/features/atlas";

export const metadata: Metadata = {
  title: "Atlas - Frame",
  description:
    "Explore cinematic filming locations on an immersive interactive movie map.",
};

export default function Page() {
  return <AtlasPage />;
}
