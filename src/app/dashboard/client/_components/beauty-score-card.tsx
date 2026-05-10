import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { ClientScore } from '@/lib/queries/client-bookings'

type Props = {
  score: ClientScore
}

const LEVELS = {
  new:      { emoji: '🆕', label: 'Новый',        next: 50,  bg: 'from-blue-50 to-blue-100',   text: 'text-blue-900',  bar: 'bg-blue-500' },
  verified: { emoji: '✅', label: 'Проверенный',  next: 150, bg: 'from-amber-50 to-amber-100', text: 'text-amber-900', bar: 'bg-amber-500' },
  trusted:  { emoji: '⭐', label: 'Доверенный',   next: 999, bg: 'from-green-50 to-green-100', text: 'text-green-900', bar: 'bg-green-500' },
}

const LEVEL_HINTS: Record<string, string> = {
  new:      'Выполните 5 услуг, чтобы стать Проверенным клиентом и получить привилегии!',
  verified: 'Отлично! Ещё 10 услуг — и вы станете Доверенным клиентом!',
  trusted:  'Поздравляем! Вы Доверенный клиент и получаете особые привилегии! 🎉',
}

export function BeautyScoreCard({ score }: Props) {
  const cfg = LEVELS[score.level as keyof typeof LEVELS] ?? LEVELS.new
  const progress = Math.min(Math.round((score.score / cfg.next) * 100), 100)

  return (
    <Card className={`p-6 bg-gradient-to-br ${cfg.bg} border-0`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Beauty Score</p>
          <h2 className={`text-3xl font-bold ${cfg.text}`}>
            {cfg.emoji} {cfg.label}
          </h2>
        </div>
        <div className={`text-right ${cfg.text}`}>
          <p className="text-2xl font-bold">{score.score}</p>
          <p className="text-sm opacity-70">из {cfg.next} баллов</p>
        </div>
      </div>

      <Progress value={progress} className="h-2.5 mb-3" />

      <div className={`flex justify-between text-xs ${cfg.text} opacity-70 mb-3`}>
        <span>{score.completed_bookings} выполнено из {score.total_bookings}</span>
        <span>{progress}%</span>
      </div>

      <p className={`text-sm ${cfg.text} opacity-80`}>
        {LEVEL_HINTS[score.level]}
      </p>
    </Card>
  )
}
