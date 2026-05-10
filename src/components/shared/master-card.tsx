import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import type { MasterListItem } from '@/lib/queries/masters'
import { formatPrice } from '@/lib/utils'

type Props = {
  master: MasterListItem
}

const CATEGORY_LABELS: Record<string, string> = {
  nail: '💅 Ногти',
  lash: '✨ Ресницы',
  brow: '👁️ Брови',
  hair: '💇 Волосы',
  makeup: '💄 Макияж',
  cosmetology: '🧴 Косметология',
}

export function MasterCard({ master }: Props) {
  return (
    <Link href={`/masters/${master.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {/* Фото */}
        <div className="relative w-full h-48 bg-muted shrink-0">
          {master.primary_photo ? (
            <Image
              src={master.primary_photo}
              alt={master.full_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Нет фото
            </div>
          )}
        </div>

        {/* Содержимое */}
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          <div>
            <h3 className="font-semibold text-lg">{master.full_name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {master.rating.toFixed(1)} ({master.reviews_count})
              </span>
            </div>
          </div>

          {/* Категории */}
          <div className="flex flex-wrap gap-2">
            {master.categories.map(cat => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {CATEGORY_LABELS[cat]}
              </Badge>
            ))}
          </div>

          {/* Цена и адрес */}
          <div className="space-y-1 text-sm text-muted-foreground flex-1">
            {master.min_price && (
              <p>от {formatPrice(master.min_price)}</p>
            )}
            {master.address && (
              <p className="line-clamp-1">📍 {master.address}</p>
            )}
          </div>

          <Button className="w-full mt-auto" size="sm">
            Записаться
          </Button>
        </div>
      </Card>
    </Link>
  )
}
