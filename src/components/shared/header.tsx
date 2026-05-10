import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import LogoutButton from './logout-button'
import { cn } from '@/lib/utils'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <header className="border-b">
        <div className="container mx-auto flex justify-between items-center py-4 px-4">
          <Link href="/" className="text-2xl font-bold">
            💄 Beauty
          </Link>
          <div className="flex gap-2">
            <Link href="/login" className={cn(buttonVariants({ variant: 'outline' }))}>
              Войти
            </Link>
            <Link href="/register" className={cn(buttonVariants())}>
              Регистрация
            </Link>
          </div>
        </div>
      </header>
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const dashboardHref = profile?.role === 'master' ? '/dashboard/master' : '/dashboard/client'
  const dashboardLabel = profile?.role === 'master' ? 'Кабинет мастера' : 'Мой кабинет'

  return (
    <header className="border-b">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link href="/" className="text-2xl font-bold">
          💄 Beauty
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline' }))}>
            {profile?.full_name || user.email}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={dashboardHref} className="w-full">{dashboardLabel}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
