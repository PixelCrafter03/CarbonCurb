import "./globals.css";

export const metadata = {
  title: "CarbonCurb",
  description: "AI-powered sustainable school commute planning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}