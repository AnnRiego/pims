import "./globals.css";

export const metadata = {
  title: "PIMS | Property Inventory and Management System",
  description:
    "Property Inventory and Management System for managing company properties, equipment, and asset movements.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}