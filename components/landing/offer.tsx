import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CHECKOUT_URL } from '@/lib/site'

const INCLUDED = [
  'Painel administrativo completo',
  'Catálogo com seu domínio/subdomínio',
  'Configuração e suporte na implantação',
  'Sem mensalidade, sem taxa por pedido',
]

export function Offer() {
  return (
    <section id="oferta" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-brand-dark text-brand-foreground shadow-xl">
          <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-brand-foreground/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                Oferta de Lançamento — Vagas Limitadas
              </span>

              <div className="mt-6 flex items-end gap-3">
                <span className="text-lg font-medium text-brand-foreground/60 line-through">R$ 1.497</span>
                <span className="text-5xl font-black leading-none">R$ 597</span>
              </div>
              <p className="mt-2 text-sm font-medium text-brand-foreground/80">Pagamento único</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-lg bg-brand-foreground px-3 py-1.5 text-sm font-bold text-brand-dark">
                  Cupom SOBERANO
                </span>
                <span className="text-sm font-semibold text-brand-foreground/90">
                  Apenas 5 vagas para implementação assistida nesta semana.
                </span>
              </div>

              <Button
                size="lg"
                render={<a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" />}
                className="mt-8 h-12 w-full px-6 text-base bg-brand-foreground font-bold text-brand-dark hover:bg-brand-soft sm:w-auto"
              >
                Garantir minha vaga
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="rounded-2xl bg-brand-foreground/10 p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-wide text-brand-foreground/70">
                O que está incluso
              </p>
              <ul className="mt-4 space-y-4">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-foreground text-brand-dark">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="font-medium leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
