'use server'

import { createClient } from '@/lib/supabase/server'
import type { Result } from '@/types/result'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getMasterSlots, type Slot } from '@/lib/queries/slots'

const bookingSchema = z.object({
  master_id: z.string().uuid(),
  service_id: z.string().uuid(),
  slot_id: z.string().uuid(),
  client_notes: z.string().max(500).optional(),
})

export async function createBookingAction(
  input: z.infer<typeof bookingSchema>
): Promise<Result<{ id: string }>> {
  const parsed = bookingSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Неверные данные' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Войдите в аккаунт' }

  try {
    const { data, error } = await supabase.rpc('create_booking_atomic', {
      p_client_id: user.id,
      p_master_id: parsed.data.master_id,
      p_service_id: parsed.data.service_id,
      p_slot_id: parsed.data.slot_id,
      p_client_notes: parsed.data.client_notes ?? null,
    })

    if (error) {
      if (error.message.includes('slot_already_booked')) {
        return { success: false, error: 'Этот слот уже занят, выберите другое время' }
      }
      if (error.message.includes('slot_in_past')) {
        return { success: false, error: 'Нельзя записаться на прошедшее время' }
      }
      if (error.message.includes('service_not_found')) {
        return { success: false, error: 'Услуга не найдена' }
      }
      return { success: false, error: 'Не удалось создать запись. Попробуйте ещё раз.' }
    }

    revalidatePath(`/masters/${parsed.data.master_id}`)
    revalidatePath('/dashboard/client')
    return { success: true, data: { id: data as string } }
  } catch (err) {
    console.error('Booking error:', err)
    return { success: false, error: 'Ошибка при создании записи' }
  }
}

export async function getSlotsAction(masterId: string): Promise<Slot[]> {
  return getMasterSlots(masterId)
}
