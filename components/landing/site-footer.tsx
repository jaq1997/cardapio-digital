import { Instagram, Mail, ShoppingBag } from 'lucide-react'
import { EVOLUX_SITE_URL } from '@/lib/site'

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

const QUICK_LINKS = [
  { label: 'Para quem é', href: '#para-quem-e' },
  { label: 'Comparativo', href: '#comparativo' },
  { label: 'Planos', href: '#oferta' },
  { label: 'FAQ', href: '#faq' },
]

const SEGMENT_LINKS = [
  { label: 'Alimentação & Delivery', href: '#para-quem-e' },
  { label: 'Beleza & Serviços', href: '#para-quem-e' },
  { label: 'Varejo & Lojas', href: '#para-quem-e' },
  { label: 'Hospedagem & Turismo', href: '#para-quem-e' },
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
              WhatsApp, sem mensalidade por comissão.
            </p>
            <div className="mt-4 text-xs font-semibold text-muted-foreground">
              Uma solução <a href={EVOLUX_SITE_URL} target="_blank" rel="noopener noreferrer" className="text-foreground font-bold hover:text-brand underline underline-offset-4 transition-colors">Evolux360</a>
            </div>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-12">
            <nav aria-label="Segmentos Atendidos">
              <p className="text-sm font-bold text-foreground">Segmentos</p>
              <ul className="mt-4 space-y-2.5">
                {SEGMENT_LINKS.map((link) => (
                  <li key={link.label}>
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

            <nav aria-label="Navegação">
              <p className="text-sm font-bold text-foreground">Navegação</p>
              <ul className="mt-4 space-y-2.5">
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
              <p className="text-sm font-bold text-foreground">Fale Conosco — Evolux360</p>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="https://instagram.com/souevolux360"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    <InstagramIcon className="h-4 w-4 text-brand" />
                    <span>@souevolux360</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contato@evolux360.com.br"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    <Mail className="h-4 w-4 text-brand" />
                    <span>contato@evolux360.com.br</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Desenvolvido com alta performance por <a href={EVOLUX_SITE_URL} target="_blank" rel="noopener noreferrer" className="text-foreground font-bold hover:text-brand transition-colors">Evolux360</a>.
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 Evolux360. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
