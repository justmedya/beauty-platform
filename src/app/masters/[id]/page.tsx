import { getMasterProfile } from '@/lib/queries/master-profile'
import { type Metadata } from 'next'
import Image from 'next/image'
import { PortfolioGallery } from './_components/portfolio-gallery'
import { ServicesList } from './_components/services-list'
import { ReviewsList } from './_components/reviews-list'
import { BookingButton } from './_components/booking-button'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const master = await getMasterProfile(id)
  
  return {
    title: `${master.profiles.full_name} — мастер красоты в Астане | Beauty Platform`,
    description: master.bio?.slice(0, 160) || 'Профессиональный мастер красоты',
    openGraph: {
      title: master.profiles.full_name,
      description: master.bio?.slice(0, 160),
      images: master.portfolio_photos?.[0]?.url ? [master.portfolio_photos[0].url] : [],
      type: 'profile',
    },
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  nail: '💅 Ногти',
  lash: '✨ Ресницы',
  brow: '👁️ Брови',
  hair: '💇 Волосы',
  makeup: '💄 Макияж',
  cosmetology: '🧴 Косметология',
}

export default async function MasterProfilePage({ params }: Props) {
  const { id } = await params
  const master = await getMasterProfile(id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: master.profiles.full_name,
    image: master.portfolio_photos?.[0]?.url,
    description: master.bio,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Астана',
      streetAddress: master.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: master.lat,
      longitude: master.lng,
    },
    ...(master.reviews_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: master.rating,
        reviewCount: master.reviews_count,
      },
    }),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <div className="relative h-96 bg-gradient-to-b from-primary/10 to-transparent">
          {master.portfolio_photos?.[0] && (
            <Image
              src={master.portfolio_photos[0].url}
              alt={master.profiles.full_name}
              fill
              className="object-cover opacity-20"
            />
          )}

          <div className="absolute inset-0 flex items-end justify-center pb-8">
            <div className="flex flex-col items-center gap-4">
              {master.profiles.avatar_url && (
                <Image
                  src={master.profiles.avatar_url}
                  alt={master.profiles.full_name}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white shadow-lg object-cover"
                />
              )}
              <div className="text-center">
                <h1 className="text-4xl font-bold">{master.profiles.full_name}</h1>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(master.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">
                    {master.rating.toFixed(1)} ({master.reviews_count})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Основной контент */}
            <div className="md:col-span-2 space-y-12">
              {/* О мастере */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Обо мне</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">{master.bio}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {master.categories.map((cat: string) => (
                    <Badge key={cat} variant="secondary">
                      {CATEGORY_LABELS[cat]}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {master.address && (
                    <div>
                      <p className="text-muted-foreground">Адрес</p>
                      <p className="font-semibold">{master.address}</p>
                    </div>
                  )}
                  {master.instagram_handle && (
                    <div>
                      <p className="text-muted-foreground">Instagram</p>
                      <a
                        href={`https://instagram.com/${master.instagram_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary hover:underline"
                      >
                        @{master.instagram_handle}
                      </a>
                    </div>
                  )}
                </div>
              </section>

              {/* Портфолио */}
              {master.portfolio_photos && master.portfolio_photos.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Портфолио</h2>
                  <PortfolioGallery photos={master.portfolio_photos} />
                </section>
              )}

              {/* Услуги */}
              {master.services && master.services.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Услуги</h2>
                  <ServicesList services={master.services} />
                </section>
              )}

              {/* Отзывы */}
              {master.reviews && master.reviews.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Отзывы ({master.reviews_count})</h2>
                  <ReviewsList reviews={master.reviews} />
                </section>
              )}
            </div>

            {/* Боковая панель — кнопка записи (десктоп) */}
            <div className="hidden md:block">
              <div className="sticky top-8 rounded-xl border bg-card p-6 shadow-sm space-y-4">
                <div>
                  <p className="font-semibold text-lg">{master.profiles.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    ⭐ {master.rating.toFixed(1)} · {master.reviews_count} отзывов
                  </p>
                </div>
                {master.services && master.services.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    от {Math.min(...master.services.map((s: { price_kzt: number }) => s.price_kzt)).toLocaleString('ru')} ₸
                  </p>
                )}
                <BookingButton
                  masterId={master.id}
                  masterName={master.profiles.full_name}
                  services={master.services ?? []}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky кнопка записи (мобайл) */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-40">
        <BookingButton
          masterId={master.id}
          masterName={master.profiles.full_name}
          services={master.services ?? []}
        />
      </div>
    </>
  )
}
