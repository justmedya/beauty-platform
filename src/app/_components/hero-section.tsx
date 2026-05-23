import Link from 'next/link'

const STATS = [
  { value: '50+', label: 'мастеров' },
  { value: '6',   label: 'категорий' },
  { value: '0%',  label: 'комиссия' },
]

const CATEGORIES = [
  { value: 'nail',        label: '💅 Маникюр' },
  { value: 'lash',        label: '✨ Ресницы' },
  { value: 'brow',        label: '👁️ Брови' },
  { value: 'hair',        label: '💇 Волосы' },
  { value: 'makeup',      label: '💄 Макияж' },
  { value: 'cosmetology', label: '🧴 Уход' },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-pink-50 border-b">
      {/* Декоративные круги */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-pink-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative container mx-auto px-4 py-14 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Бейдж */}
          <div className="inline-flex items-center gap-2 bg-white border border-violet-200 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
            Астана · Онлайн-запись
          </div>

          {/* Заголовок */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 leading-tight">
            Запись к мастерам{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              красоты
            </span>{' '}
            в Астане
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Найди своего мастера, запишись онлайн без звонков — и получи Beauty Score за каждый визит
          </p>

          {/* Статистика */}
          <div className="flex justify-center gap-8 mb-10">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* CTA кнопки */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white px-7 py-3 font-semibold text-sm shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 transition-all duration-200 hover:-translate-y-0.5"
            >
              Зарегистрироваться бесплатно
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-gray-700 px-7 py-3 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Войти
            </Link>
          </div>

          {/* Быстрые категории */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Популярные категории:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.value}
                  href={`/?category=${cat.value}`}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm hover:border-violet-300 hover:bg-violet-50 transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Волна снизу */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
