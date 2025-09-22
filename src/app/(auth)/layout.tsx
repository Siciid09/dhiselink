// This is the entire file. It simply renders the page content.
// The main RootLayout will automatically wrap it with the Header and Footer.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}