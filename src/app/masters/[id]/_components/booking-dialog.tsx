'use client'

import { useState } from 'react'
import { createBookingAction, getSlotsAction } from '../actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CheckCircle2, Loader2 } from 'lucide-react'

type ServiceItem = {
  id: string
  name: string
  price_kzt: number
  duration_minutes: number
}

type Slot = {
  id: string
  starts_at: string
  ends_at: string
}

type Props = {
  masterId: string
  masterName: string
  services: ServiceItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = 'service' | 'date' | 'confirm' | 'success'

export function BookingDialog({ masterId, masterName, services, open, onOpenChange }: Props) {
  const [step, setStep] = useState<Step>('service')
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)

  const service = services.find(s => s.id === selectedService)
  const slot = slots.find(s => s.id === selectedSlot)

  const resetAndClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setStep('service')
      setSelectedService('')
      setSelectedDate(undefined)
      setSelectedSlot('')
      setNotes('')
      setSlots([])
    }, 300)
  }

  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return
    setSelectedDate(date)
    setSelectedSlot('')
    setLoadingSlots(true)

    try {
      const allSlots = await getSlotsAction(masterId)
      const daySlots = allSlots.filter(s => {
        const slotDate = parseISO(s.starts_at)
        return (
          slotDate.getFullYear() === date.getFullYear() &&
          slotDate.getMonth() === date.getMonth() &&
          slotDate.getDate() === date.getDate()
        )
      })
      setSlots(daySlots)
    } catch {
      toast.error('Не удалось загрузить слоты')
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleBooking = async () => {
    if (!selectedService || !selectedSlot) return

    setLoading(true)
    const result = await createBookingAction({
      master_id: masterId,
      service_id: selectedService,
      slot_id: selectedSlot,
      client_notes: notes || undefined,
    })
    setLoading(false)

    if (result.success) {
      setStep('success')
    } else {
      toast.error(result.error)
      if (result.error.includes('уже занят')) {
        // обновляем слоты и возвращаем на шаг выбора
        setSelectedSlot('')
        await handleDateSelect(selectedDate)
        setStep('date')
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Запись к {masterName}</DialogTitle>
          <DialogDescription>
            {step === 'service' && 'Шаг 1 из 3 — Выберите услугу'}
            {step === 'date' && 'Шаг 2 из 3 — Выберите дату и время'}
            {step === 'confirm' && 'Шаг 3 из 3 — Подтвердите запись'}
            {step === 'success' && 'Запись создана!'}
          </DialogDescription>
        </DialogHeader>

        {/* ШАГ 1: Услуга */}
        {step === 'service' && (
          <div className="space-y-4">
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите услугу" />
              </SelectTrigger>
              <SelectContent>
                {services.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    <span className="font-medium">{s.name}</span>
                    <span className="text-muted-foreground ml-2">
                      — {s.price_kzt.toLocaleString('ru')} ₸ · {s.duration_minutes} мин
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={resetAndClose}>
                Отмена
              </Button>
              <Button
                className="flex-1"
                disabled={!selectedService}
                onClick={() => setStep('date')}
              >
                Далее
              </Button>
            </div>
          </div>
        )}

        {/* ШАГ 2: Дата и время */}
        {step === 'date' && (
          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
              locale={ru}
              className="rounded-md border w-full"
            />

            {selectedDate && (
              <div>
                <p className="text-sm font-medium mb-2">
                  Время на {format(selectedDate, 'd MMMM', { locale: ru })}:
                </p>
                {loadingSlots ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-3 border rounded-md">
                    Нет свободных слотов на эту дату
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSlot(s.id)}
                        className={`py-2 rounded-md border text-sm font-medium transition-all ${
                          selectedSlot === s.id
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {format(parseISO(s.starts_at), 'HH:mm')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('service')}>
                Назад
              </Button>
              <Button
                className="flex-1"
                disabled={!selectedSlot}
                onClick={() => setStep('confirm')}
              >
                Далее
              </Button>
            </div>
          </div>
        )}

        {/* ШАГ 3: Подтверждение */}
        {step === 'confirm' && service && selectedDate && slot && (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Услуга</span>
                <span className="font-semibold">{service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата</span>
                <span className="font-semibold">
                  {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Время</span>
                <span className="font-semibold">{format(parseISO(slot.starts_at), 'HH:mm')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Длительность</span>
                <span className="font-semibold">{service.duration_minutes} мин</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-muted-foreground">Итого</span>
                <span className="font-bold text-base">
                  {service.price_kzt.toLocaleString('ru')} ₸
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Пожелания (необязательно)</label>
              <Textarea
                placeholder="Напишите пожелания мастеру..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                maxLength={500}
                className="mt-2 resize-none"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {notes.length}/500
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('date')}>
                Назад
              </Button>
              <Button className="flex-1" onClick={handleBooking} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Создание...
                  </>
                ) : (
                  'Подтвердить запись'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ШАГ 4: Успех */}
        {step === 'success' && (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <p className="text-lg font-semibold">Запись создана!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Мастер подтвердит вашу запись в ближайшее время
              </p>
            </div>
            <Button className="w-full" onClick={resetAndClose}>
              Закрыть
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
