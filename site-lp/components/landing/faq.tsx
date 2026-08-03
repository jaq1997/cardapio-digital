import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const FAQS = [
  {
    q: 'Preciso pagar mensalidade?',
    a: 'Não. A Evolux Catálogo é pagamento único. Você não paga mensalidade recorrente nem comissão por pedido — a vitrine é sua e continua sua.',
  },
  {
    q: 'Funciona para o meu tipo de negócio?',
    a: 'Sim. A mesma tecnologia atende alimentação, serviços, turismo e varejo em geral. Seja um cardápio, uma lista de serviços com preços ou um catálogo de produtos com variações, tudo se adapta ao seu negócio.',
  },
  {
    q: 'Como meus clientes fazem o pedido?',
    a: 'O cliente navega pelo seu catálogo, escolhe os itens e envia o pedido já formatado direto no seu WhatsApp. Você recebe tudo organizado e fecha a venda conversando normalmente.',
  },
  {
    q: 'Eu preciso saber programar para usar o painel?',
    a: 'Não. O painel é tão simples quanto editar uma planilha: você adiciona um produto ou muda um preço e em segundos já está no ar. Sem código, sem complicação.',
  },
  {
    q: 'E se eu quiser um domínio próprio depois?',
    a: 'Sem problema. Você pode começar com um subdomínio e conectar o seu próprio domínio quando quiser. A vitrine é sua e acompanha o crescimento do seu negócio.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 bg-secondary py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Perguntas frequentes
          </h2>
        </div>

        <Accordion className="mt-10 w-full space-y-3">
          {FAQS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-border bg-card px-5 last:border-b"
            >
              <AccordionTrigger className="text-left text-base font-bold text-card-foreground hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
