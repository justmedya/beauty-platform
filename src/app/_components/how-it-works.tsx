const CLIENT_STEPS = [
  { icon: '🔍', title: 'Найди мастера', desc: 'Фильтруй по категории, цене и рейтингу. Смотри портфолио и отзывы.' },
  { icon: '📅', title: 'Выбери время', desc: 'Выбери удобный слот из расписания мастера. Без звонков и переписок.' },
  { icon: '✅', title: 'Приди и получи скидку', desc: 'Накапливай Beauty Score — получай до 10% скидки и привилегии.' },
]

const MASTER_STEPS = [
  { icon: '🆓', title: 'Регистрируйся бесплатно', desc: 'Создай профиль с портфолио и услугами за 5 минут. 0% комиссии.' },
  { icon: '🗓️', title: 'Управляй расписанием', desc: 'Устанавливай рабочие слоты, принимай и отклоняй записи онлайн.' },
  { icon: '📊', title: 'Расти вместе с нами', desc: 'Аналитика, отзывы, буст профиля — всё в одном кабинете.' },
]

export function HowItWorks() {
  return (
    <section className="bg-muted/30 border-b py-14 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Как это работает
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* For clients */}
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-5">
              Для клиентов
            </p>
            <div className="space-y-6">
              {CLIENT_STEPS.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                    {step.icon}
                  </div>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For masters */}
          <div>
            <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-5">
              Для мастеров
            </p>
            <div className="space-y-6">
              {MASTER_STEPS.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-xl">
                    {step.icon}
                  </div>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
