export const metadata = {
  title: "TaxdCalc — UK Take-Home Pay Calculator 2026-27",
  description: "Calculate your UK net salary after income tax, NI, student loan and pension. Free, accurate, updated for 2026-27.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
