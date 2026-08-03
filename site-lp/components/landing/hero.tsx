import { ArrowRight, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PhoneMockup } from './phone-mockup'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-brand-soft/60" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pb-24">
        <div>
          <span className="inline-flex items-center rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-dark">
            Vitrine digital para qualquer negócio
          </span>
          <h1 className="mt-5 text-balance text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Sua vitrine digital, <span className="italic text-brand">sua regra.</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Catálogo online com sua marca, seu domínio e seu controle — sem mensalidade, sem
            comissão por venda, sem depender de plataforma de terceiro.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              render={<a href="#oferta" />}
              className="h-12 px-6 text-base bg-brand font-semibold text-brand-foreground hover:bg-brand-dark"
            >
              Quero minha vitrine
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<a href="#como-funciona" />}
              className="h-12 px-6 text-base border-border font-semibold text-foreground hover:bg-brand-soft hover:text-brand-dark"
            >
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              Ver como funciona
            </Button>
          </div>

          <p className="mt-5 text-sm font-medium text-muted-foreground">
            Sem fidelidade · Sem taxa por pedido · Suporte humano
          </p>
        </div>

        <div className="relative">
          <div
            className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-brand-soft/70 blur-0 sm:-inset-8"
            aria-hidden="true"
          />
          <PhoneMockup
            storeName="Sua Marca Aqui"
            categories={['Destaques', 'Mais vendidos', 'Novidades']}
            items={[
              { name: 'Produto em destaque', price: 'R$ 62,90', meta: 'Escolha tamanho e adicionais' },
              { name: 'Combo especial', price: 'R$ 45,00', meta: 'Pronto para pedir' },
              { name: 'Item da semana', price: 'R$ 29,90', meta: 'Disponível agora' },
            ]}
          />
        </div>
      </div>
    </section>
  )
}
