import { Zap } from 'lucide-react'
import ButtonsSection from './buttons-section'

export function ChallengeHero() {


  return (
    <section className="relative min-h-screen w-full overflow-hidden]">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        
        <div className="">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-pulse text-yellow-400 md:-top-16">
            <Zap className="h-12 w-12 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] md:h-16 md:w-16" />
          </div>

          <h1 className="text-center text-[90px] font-extrabold leading-none tracking-tight sm:text-[120px] md:text-[142px] italic">
              <span className="inline-block text-red-500">من</span>
              {' '}
              <span className="inline-block text-blue-500">الأسرع ؟</span>
          </h1>
        </div>

        <ButtonsSection />
      </div>
    </section>
  )
}