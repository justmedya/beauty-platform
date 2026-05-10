import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BasicsStep } from './_components/basics-step'
import { LocationStep } from './_components/location-step'
import { PhotosStep } from './_components/photos-step'
import { ServicesStep } from './_components/services-step'
import { Stepper } from '@/components/shared/stepper'

export default async function OnboardingPage(props: {
  searchParams: Promise<{ step?: string }>
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'master') {
    redirect('/')
  }

  const { data: masterInfo } = await supabase.from('masters').select('*').eq('profile_id', user.id).single()

  const step = parseInt(searchParams?.step || '1')

  return (
    <main className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Создание профиля мастера</h1>
          <p className="text-muted-foreground">Заполните информацию о себе и услугах</p>
        </div>

        <Stepper currentStep={step} totalSteps={4} />

        <div className="mt-8">
          {step === 1 && <BasicsStep initialData={masterInfo} />}
          {step === 2 && <LocationStep initialData={masterInfo} />}
          {step === 3 && <PhotosStep />}
          {step === 4 && <ServicesStep />}
        </div>
      </div>
    </main>
  )
}
