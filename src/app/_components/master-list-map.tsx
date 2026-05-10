'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MasterCard } from '@/components/shared/master-card'
import { MasterMap } from '@/components/shared/master-map'
import { FiltersBar } from './filters-bar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { MasterListItem } from '@/lib/queries/masters'

type Props = {
  initialMasters: MasterListItem[]
}

export function MasterListMap({ initialMasters: masters }: Props) {
  const [selectedId, setSelectedId] = useState<string | undefined>()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleMasterSelect = (masterId: string) => {
    setSelectedId(masterId)
    // Скролл к карточке в списке
    const element = document.getElementById(`master-${masterId}`)
    element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-64px)]">
      <FiltersBar />

      {/* Desktop: двухколоночный макет */}
      <div className="hidden md:grid md:grid-cols-2 flex-1 gap-4 p-4 overflow-hidden">
        {/* Список слева */}
        <div className="overflow-y-auto pr-2 pb-8">
          {masters.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Мастеров не найдено
            </div>
          ) : (
            <div className="space-y-3">
              {masters.map(master => (
                <div
                  key={master.id}
                  id={`master-${master.id}`}
                  className={`relative transition-all rounded-lg ${
                    selectedId === master.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <MasterCard master={master} />
                  {/* Невидимая полоска слева для синхронизации с картой без перехвата клика по карточке */}
                  <button
                    onClick={() => handleMasterSelect(master.id)}
                    className="absolute left-0 top-0 bottom-0 w-3 z-10 opacity-0"
                    aria-label="Показать на карте"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Карта справа */}
        <div className="rounded-lg overflow-hidden border h-full">
          <MasterMap masters={masters} selectedId={selectedId} onSelect={handleMasterSelect} />
        </div>
      </div>

      {/* Mobile: вкладки */}
      <div className="md:hidden flex-1 overflow-hidden">
        <Tabs defaultValue="list" className="h-full flex flex-col">
          <TabsList className="w-full rounded-none border-b shrink-0">
            <TabsTrigger value="list" className="flex-1">Список</TabsTrigger>
            <TabsTrigger value="map" className="flex-1">Карта</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="flex-1 overflow-y-auto p-4 m-0 data-[state=inactive]:hidden">
            {masters.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Мастеров не найдено
              </div>
            ) : (
              <div className="space-y-3">
                {masters.map(master => (
                  <div
                    key={master.id}
                    onClick={() => router.push(`/masters/${master.id}`)}
                  >
                    <MasterCard master={master} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="map" className="flex-1 p-0 m-0 data-[state=inactive]:hidden">
            <MasterMap masters={masters} selectedId={selectedId} onSelect={handleMasterSelect} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
