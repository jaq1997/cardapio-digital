import { Star } from 'lucide-react'

type Testimonial = {
  quote: string
  business: string
  city: string
  initials: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Profissionalizei meu atendimento e parei de perder pedido no WhatsApp. O cliente já manda tudo certinho.',
    business: 'Hamburgueria do Bairro',
    city: 'Campinas, SP',
    initials: 'HB',
  },
  {
    quote:
      'Meus clientes agendam sozinhos escolhendo o serviço. Ganhei tempo e a agenda ficou muito mais organizada.',
    business: 'Studio de Beleza Aura',
    city: 'Curitiba, PR',
    initials: 'SA',
  },
  {
    quote:
      'Finalmente tenho um site com a minha cara e o meu domínio. Não pago comissão e a vitrine é minha de verdade.',
    business: 'Pousada Recanto Verde',
    city: 'Tiradentes, MG',
    initials: 'PR',
  },
]

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Quem já usa, recomenda.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.business}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex gap-0.5 text-brand" aria-label="5 de 5 estrelas">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-dark">
                  {t.initials}
                </span>
                <span>
                  <span className="block text-sm font-bold text-card-foreground">{t.business}</span>
                  <span className="block text-xs text-muted-foreground">{t.city}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
