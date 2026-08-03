import { MessageCircle, Search, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

export type MockItem = {
  name: string
  price: string
  meta?: string
}

type PhoneMockupProps = {
  storeName: string
  categories: string[]
  items: MockItem[]
  className?: string
}

export function PhoneMockup({ storeName, categories, items, className }: PhoneMockupProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[300px] rounded-[2.25rem] border border-border bg-foreground p-2 shadow-2xl shadow-brand/20',
        className,
      )}
    >
      <div className="overflow-hidden rounded-[1.75rem] bg-background">
        {/* Top bar */}
        <div className="bg-brand px-4 pb-5 pt-6 text-brand-foreground">
          <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-brand-foreground/40" aria-hidden="true" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-foreground/20">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">{storeName}</p>
              <p className="text-[11px] text-brand-foreground/70">Aberto agora · Peça pelo WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pt-3">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-muted-foreground">
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-[11px]">Buscar no catálogo</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-hidden px-4 pt-3">
          {categories.map((cat, i) => (
            <span
              key={cat}
              className={cn(
                'whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium',
                i === 0 ? 'bg-brand text-brand-foreground' : 'bg-secondary text-secondary-foreground',
              )}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Items */}
        <div className="space-y-2 px-4 py-3">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-[9px] font-medium text-muted-foreground">
                mockup
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-card-foreground">{item.name}</p>
                {item.meta && <p className="text-[11px] text-muted-foreground">{item.meta}</p>}
                <p className="text-xs font-bold text-brand">{item.price}</p>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft text-brand">
                +
              </span>
            </div>
          ))}
        </div>

        {/* WhatsApp button */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-xs font-bold text-brand-foreground">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Fazer pedido no WhatsApp
          </div>
        </div>
      </div>
    </div>
  )
}
