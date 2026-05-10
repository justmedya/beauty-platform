'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { X } from 'lucide-react'

const CATEGORIES = [
  { value: 'nail', label: '💅 Ногти' },
  { value: 'lash', label: '✨ Ресницы' },
  { value: 'brow', label: '👁️ Брови' },
  { value: 'hair', label: '💇 Волосы' },
  { value: 'makeup', label: '💄 Макияж' },
  { value: 'cosmetology', label: '🧴 Косметология' },
]

export function FiltersBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const query = searchParams.get('q') || ''

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('category', value)
    } else {
      params.delete('category')
    }
    params.delete('page')
    router.replace(`/?${params.toString()}`)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams)
    if (e.target.value) {
      params.set('q', e.target.value)
    } else {
      params.delete('q')
    }
    params.delete('page')
    router.replace(`/?${params.toString()}`)
  }

  const handleReset = () => {
    router.replace('/')
  }

  const hasFilters = category || query

  return (
    <div className="border-b bg-muted/30 p-4 shrink-0">
      <div className="container mx-auto space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Поиск мастера или адреса..."
            value={query}
            onChange={handleSearch}
            className="flex-1"
          />
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              <X className="w-4 h-4 mr-2" />
              Сбросить
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <ToggleGroup type="single" value={category || ''} onValueChange={handleCategoryChange} className="justify-start">
            {CATEGORIES.map(cat => (
              <ToggleGroupItem key={cat.value} value={cat.value} aria-label={cat.label} className="whitespace-nowrap shrink-0">
                {cat.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
    </div>
  )
}
