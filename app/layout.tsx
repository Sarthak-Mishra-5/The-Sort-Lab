import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sorting Visualizer",
  keywords: [
    "sorting",
    "visualizer",
    "algorithms",
    "sorting algorithms",
    "visualization",
    "educational",
    "interactive",
    "learning",
    "computer science",
  ],
  description:
    "A sorting visualizer to help understand sorting algorithms through interactive animations.",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
