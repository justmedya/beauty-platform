import { getMasters } from '@/lib/queries/masters'
import { MasterListMap } from './_components/master-list-map'
import { Suspense } from 'react'

export default async function Home(props: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const searchParams = await props.searchParams;
  const masters = await getMasters({
    category: searchParams.category,
    search: searchParams.q,
  })

  return (
    <main className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Загрузка...</div>}>
        <MasterListMap initialMasters={masters} />
      </Suspense>
    </main>
  )
}
