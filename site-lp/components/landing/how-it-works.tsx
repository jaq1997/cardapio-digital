import { Play } from 'lucide-react'

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 bg-secondary py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Tão simples quanto editar uma planilha.
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Você atualiza o preço ou adiciona um produto no painel — e em segundos já está no ar, na
            sua vitrine.
          </p>
        </div>

        <div className="mt-12">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-foreground shadow-lg">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <button
                type="button"
                aria-label="Reproduzir vídeo demonstrativo"
                className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-xl transition-transform hover:scale-105"
              >
                <Play className="h-8 w-8 fill-current" aria-hidden="true" />
              </button>
              <span className="text-sm font-medium text-background/70">Vídeo demonstrativo em breve</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
