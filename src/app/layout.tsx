import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thumbnail Uploader",
  description: "Application for uploading and managing thumbnails",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
