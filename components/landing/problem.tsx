import { CloudOff, Lock, TrendingUp, Unplug } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Problem = {
  icon: LucideIcon
  title: string
  text: string
}

const PROBLEMS: Problem[] = [
  {
    icon: Unplug,
    title: 'Você não é dono',
    text: 'Se a plataforma mudar as regras, aumentar taxa ou sair do ar, seu negócio para junto.',
  },
  {
    icon: CloudOff,
    title: 'Cai na hora que mais importa',
    text: 'Sistema instável derruba pedido justo no fim de semana, feriado ou Dia dos Namorados — quando o movimento é maior.',
  },
  {
    icon: TrendingUp,
    title: 'Custo que sobe sem aviso',
    text: 'Mensalidade que aumenta com o seu faturamento, ou comissão que corrói sua margem a cada venda.',
  },
  {
    icon: Lock,
    title: 'Sem controle dos seus dados',
    text: 'Sua base de clientes não é sua — você não pode exportar, não pode migrar, não pode usar como quiser.',
  },
]

export function Problem() {
  return (
    <section className="bg-secondary py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Por que fugir das plataformas &quot;gratuitas&quot;?
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-card-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
