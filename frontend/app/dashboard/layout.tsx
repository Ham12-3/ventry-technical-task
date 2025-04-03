// In app/dashboard/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side check for token - cookies() is async in newer Next.js versions
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  
  if (!token) {
    redirect('/sign-in?error=Please sign in to access this page');
  }
  
  return <>{children}</>;
}