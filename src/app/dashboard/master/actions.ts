'use server'

import { createClient } from '@/lib/supabase/server'
import type { Result } from '@/types/result'
import { revalidatePath } from 'next/cache'

export async function confirmBookingAction(bookingId: string): Promise<Result> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Войдите' }

  const { data: booking } = await supabase
    .from('bookings')
    .select('master_id, masters!inner(profile_id)')
    .eq('id', bookingId)
    .single()

  if (!booking || (booking.masters as any).profile_id !== user.id) {
    return { success: false, error: 'Нет доступа' }
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'confirmed', status_changed_at: new Date().toISOString() })
    .eq('id', bookingId)

  if (error) return { success: false, error: 'Не удалось подтвердить' }

  revalidatePath('/dashboard/master')
  return { success: true, data: undefined }
}

export async function completeBookingAction(bookingId: string): Promise<Result> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Войдите' }

  const { data: booking } = await supabase
    .from('bookings')
    .select('master_id, starts_at, masters!inner(profile_id)')
    .eq('id', bookingId)
    .single()

  if (!booking || (booking.masters as any).profile_id !== user.id) {
    return { success: false, error: 'Нет доступа' }
  }

  if (new Date(booking.starts_at) > new Date()) {
    return { success: false, error: 'Запись ещё не наступила' }
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'completed', status_changed_at: new Date().toISOString() })
    .eq('id', bookingId)

  if (error) return { success: false, error: 'Не удалось завершить' }

  revalidatePath('/dashboard/master')
  return { success: true, data: undefined }
}

export async function cancelBookingAction(bookingId: string, reason?: string): Promise<Result> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Войдите' }

  const { data: booking } = await supabase
    .from('bookings')
    .select('slot_id, master_id, masters!inner(profile_id)')
    .eq('id', bookingId)
    .single()

  if (!booking || (booking.masters as any).profile_id !== user.id) {
    return { success: false, error: 'Нет доступа' }
  }

  const { error: bookingError } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled_by_master',
      status_changed_at: new Date().toISOString(),
      master_notes: reason,
    })
    .eq('id', bookingId)

  if (bookingError) return { success: false, error: 'Не удалось отменить' }

  await supabase.from('slots').update({ is_booked: false }).eq('id', booking.slot_id)

  revalidatePath('/dashboard/master')
  return { success: true, data: undefined }
}
