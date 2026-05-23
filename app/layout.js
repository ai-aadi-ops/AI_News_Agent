import "./globals.css";

export const metadata = {
  title: "AI News Terminal | Local Feed",
  description: "Latest AI news and updates from around the globe.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
