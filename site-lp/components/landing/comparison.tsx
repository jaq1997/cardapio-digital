import { Check, X } from 'lucide-react'

type Row = {
  feature: string
  evolux: string
  others: string
}

const ROWS: Row[] = [
  {
    feature: 'Pagamento',
    evolux: 'Único, sem mensalidade',
    others: 'Mensalidade recorrente ou % por faturamento',
  },
  {
    feature: 'Propriedade',
    evolux: 'Painel e dados 100% seus',
    others: 'Você é um inquilino da plataforma',
  },
  {
    feature: 'Marca',
    evolux: 'Sua identidade visual, seu domínio',
    others: 'Link genérico compartilhado',
  },
  {
    feature: 'Suporte',
    evolux: 'Humano, direto no WhatsApp',
    others: 'Robô / ticket',
  },
  {
    feature: 'Desempenho',
    evolux: 'Site próprio, rápido, sem concorrer com outros lojistas',
    others: 'Lentidão em horário de pico',
  },
  {
    feature: 'Setor',
    evolux: 'Qualquer segmento (comida, serviço, turismo, varejo)',
    others: 'Nichado (geralmente só delivery de comida)',
  },
]

export function Comparison() {
  return (
    <section id="comparativo" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Evolux Catálogo vs. Plataformas Alugadas
          </h2>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_1.2fr_1.2fr] border-b border-border bg-muted/60 sm:grid-cols-3">
            <div className="p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:p-5" />
            <div className="border-l border-border bg-brand-soft p-4 text-center sm:p-5">
              <span className="text-sm font-extrabold text-brand-dark sm:text-base">Evolux Catálogo</span>
            </div>
            <div className="border-l border-border p-4 text-center sm:p-5">
              <span className="text-sm font-semibold text-muted-foreground sm:text-base">Plataformas Comuns</span>
            </div>
          </div>

          {ROWS.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_1.2fr_1.2fr] sm:grid-cols-3 ${
                i % 2 === 1 ? 'bg-muted/30' : 'bg-card'
              }`}
            >
              <div className="flex items-center p-4 text-sm font-bold text-foreground sm:p-5">
                {row.feature}
              </div>
              <div className="flex items-start gap-2 border-l border-border bg-brand-soft/40 p-4 sm:p-5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium leading-snug text-foreground">{row.evolux}</span>
              </div>
              <div className="flex items-start gap-2 border-l border-border p-4 sm:p-5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <X className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="text-sm leading-snug text-muted-foreground">{row.others}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
