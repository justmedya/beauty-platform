import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatPrice, formatDuration } from '@/lib/utils'
import { Clock, Tag } from 'lucide-react'

type Service = {
  id: string
  name: string
  category: string
  price_kzt: number
  duration_minutes: number
  description?: string
}

type Props = {
  services: Service[]
}

const CATEGORY_LABELS: Record<string, string> = {
  nail: '💅 Ногти',
  lash: '✨ Ресницы',
  brow: '👁️ Брови',
  hair: '💇 Волосы',
  makeup: '💄 Макияж',
  cosmetology: '🧴 Косметология',
}

export function ServicesList({ services }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map(service => (
        <Card key={service.id} className="p-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg">{service.name}</h3>
              <Badge variant="secondary">
                {CATEGORY_LABELS[service.category]}
              </Badge>
            </div>

            {service.description && (
              <p className="text-sm text-muted-foreground">{service.description}</p>
            )}

            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{formatPrice(service.price_kzt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{formatDuration(service.duration_minutes)}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
