import { getMasters } from '@/lib/queries/masters'
import { createClient } from '@/lib/supabase/server'
import { MasterListMap } from './_components/master-list-map'
import { HeroSection } from './_components/hero-section'
import { Suspense } from 'react'
import { MasterListSkeleton } from '@/components/shared/master-card-skeleton'

export default async function Home(props: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const searchParams = await props.searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const masters = await getMasters({
    category: searchParams.category,
    search: searchParams.q,
  })

  const hasFilters = !!(searchParams.category || searchParams.q)

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero — только незалогиненным без активных фильтров */}
      {!user && !hasFilters && <HeroSection />}

      <Suspense fallback={
        <div className="container mx-auto px-4 py-6">
          <MasterListSkeleton />
        </div>
      }>
        <MasterListMap initialMasters={masters} isAuthenticated={!!user} />
      </Suspense>
    </main>
  )
}
