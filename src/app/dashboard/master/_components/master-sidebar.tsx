'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { logoutAction } from '@/app/(auth)/actions'
import { Calendar, Home, Settings, LogOut, Menu, Wrench, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const MENU_ITEMS = [
  { href: '/dashboard/master', icon: Home, label: '📅 Записи' },
  { href: '/dashboard/master/schedule', icon: Calendar, label: '🗓️ Расписание' },
  { href: '/dashboard/master/services', icon: Wrench, label: '💅 Услуги' },
  { href: '/dashboard/master/profile', icon: Settings, label: '👤 Профиль' },
  { href: '/dashboard/master/stats', icon: BarChart3, label: '📊 Статистика' },
]

function SidebarContent() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <Link href="/" className="text-2xl font-bold">
          💄 Beauty
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Кабинет мастера</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {MENU_ITEMS.map(item => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? 'default' : 'ghost'}
              className="w-full justify-start text-sm"
            >
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <form action={logoutAction}>
          <Button variant="outline" className="w-full justify-start text-sm" type="submit">
            <LogOut className="w-4 h-4 mr-2" />
            Выйти
          </Button>
        </form>
      </div>
    </div>
  )
}

export function MasterSidebar() {
  return (
    <>
      {/* Desktop сайдбар */}
      <aside className="hidden md:flex w-64 border-r bg-background flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile гамбургер */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger
            render={
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background p-2 hover:bg-accent hover:text-accent-foreground"
              >
                <Menu className="w-5 h-5" />
              </button>
            }
          />
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
