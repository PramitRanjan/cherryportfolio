import { redirect } from 'next/navigation';
import { isAdminSession } from '@/lib/admin-auth';
import { getSiteContent } from '@/lib/site-content';
import { resolveStorageMode } from '@/lib/dashboard-storage';
import DashboardEditor from '@/components/admin/DashboardEditor';

export const metadata = {
  robots: { index: false, follow: false },
  title: 'Dashboard',
};
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  if (!(await isAdminSession())) {
    redirect('/dashboard/login');
  }

  return <DashboardEditor initialContent={getSiteContent()} storageMode={resolveStorageMode()} />;
}
