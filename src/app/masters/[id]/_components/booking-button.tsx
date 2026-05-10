'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BookingDialog } from './booking-dialog'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type ServiceItem = {
  id: string
  name: string
  price_kzt: number
  duration_minutes: number
}

type Props = {
  masterId: string
  masterName: string
  services: ServiceItem[]
}

export function BookingButton({ masterId, masterName, services }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleClick = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push(`/login?redirect=/masters/${masterId}`)
      return
    }

    setOpen(true)
  }

  return (
    <>
      <Button onClick={handleClick} size="lg" className="w-full shadow-lg">
        Записаться
      </Button>

      <BookingDialog
        masterId={masterId}
        masterName={masterName}
        services={services}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
