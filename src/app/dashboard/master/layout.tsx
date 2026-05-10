import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MasterSidebar } from './_components/master-sidebar'

export default async function MasterDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'master') {
    redirect('/')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <MasterSidebar />
      <div className="flex-1 overflow-auto bg-muted/30">
        {children}
      </div>
    </div>
  )
}
