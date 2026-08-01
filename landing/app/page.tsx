import { SiteHeader } from '@/components/landing/site-header'
import { Hero } from '@/components/landing/hero'
import { Segments } from '@/components/landing/segments'
import { Problem } from '@/components/landing/problem'
import { Comparison } from '@/components/landing/comparison'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Testimonials } from '@/components/landing/testimonials'
import { Faq } from '@/components/landing/faq'
import { SiteFooter } from '@/components/landing/site-footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Segments />
        <Problem />
        <Comparison />
        <HowItWorks />
        <Testimonials />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  )
}
