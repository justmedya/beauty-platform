import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export async function ClientHeader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user?.id ?? '')
    .maybeSingle()

  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          💄 Beauty
        </Link>
        <div className="flex items-center gap-4">
          {profile?.full_name && (
            <span className="text-sm text-muted-foreground hidden sm:block">
              {profile.full_name}
            </span>
          )}
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Поиск мастеров
          </Link>
        </div>
      </div>
    </header>
  )
}
