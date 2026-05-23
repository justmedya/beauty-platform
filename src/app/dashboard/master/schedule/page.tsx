'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateSlotsAction, deleteSlotAction } from '../actions'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Trash2 } from 'lucide-react'

export default function SchedulePage() {
  const [slots, setSlots] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [slotCount, setSlotCount] = useState(5)
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [intervalMinutes, setIntervalMinutes] = useState(60)

  const supabase = createClient()

  useEffect(() => {
    loadSlots()
  }, [])

  const loadSlots = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: master } = await supabase
      .from('masters')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (!master) return

    const { data } = await supabase
      .from('slots')
      .select('*')
      .eq('master_id', master.id)
      .order('starts_at', { ascending: true })

    setSlots(data || [])
  }

  const handleGenerateSlots = async () => {
    if (!startDate) {
      toast.error('Выберите дату')
      return
    }

    setLoading(true)
    const result = await generateSlotsAction(
      slotCount,
      startDate,
      startTime,
      durationMinutes,
      intervalMinutes
    )
    setLoading(false)

    if (result.success) {
      toast.success(`Создано ${slotCount} слотов`)
      loadSlots()
      setStartDate('')
    } else {
      toast.error(result.error)
    }
  }

  const handleDeleteSlot = async (slotId: string) => {
    setLoading(true)
    const result = await deleteSlotAction(slotId)
    setLoading(false)

    if (result.success) {
      toast.success('Слот удалён')
      loadSlots()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Расписание</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Создание слотов */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Создать слоты</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Дата начала</label>
              <Input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Время начала</label>
              <Input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Кол-во слотов</label>
              <Input
                type="number"
                min="1"
                max="20"
                value={slotCount}
                onChange={e => setSlotCount(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Длительность (мин)</label>
              <Input
                type="number"
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Интервал (мин)</label>
              <Input
                type="number"
                value={intervalMinutes}
                onChange={e => setIntervalMinutes(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleGenerateSlots}
              disabled={loading || !startDate}
              className="w-full"
            >
              {loading ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </Card>

        {/* Список слотов */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Все слоты</h2>
          {slots.length === 0 ? (
            <p className="text-muted-foreground">Слотов нет</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {slots.map(slot => (
                <div key={slot.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <p className="font-medium">
                      {format(parseISO(slot.starts_at), 'd MMM HH:mm', { locale: ru })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {slot.is_booked ? '✅ Забронирован' : '⭕ Свободен'}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSlot(slot.id)}
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Button
            variant="outline"
            className="mt-4"
            onClick={loadSlots}
          >
            Обновить
          </Button>
        </div>
      </div>
    </main>
  )
}
