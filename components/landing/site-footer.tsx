import { Camera, Mail, MessageCircle, ShoppingBag } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Para quem é', href: '#para-quem-e' },
  { label: 'Comparativo', href: '#comparativo' },
  { label: 'Planos', href: '#oferta' },
  { label: 'FAQ', href: '#faq' },
]

const SOCIALS = [
  { label: 'Instagram', icon: Camera, href: '#' },
  { label: 'WhatsApp', icon: MessageCircle, href: '#' },
  { label: 'E-mail', icon: Mail, href: '#' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <a href="#top" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-foreground">
                Evolux <span className="text-brand">Catálogo</span>
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Sua vitrine digital com a sua marca, seu domínio e seu controle. Pedidos direto no
              WhatsApp, sem mensalidade.
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <nav aria-label="Links rápidos">
              <p className="text-sm font-bold text-foreground">Navegação</p>
              <ul className="mt-4 space-y-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="text-sm font-bold text-foreground">Redes sociais</p>
              <div className="mt-4 flex gap-3">
                {SOCIALS.map((s) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            Design e desenvolvimento humano, ponta a ponta — Evolux360.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            © 2026 Evolux360. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
