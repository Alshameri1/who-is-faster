import { ChallengeHero } from '@/features/home/components/challenge-hero'
import { PopupProvider } from '@/contexts/popup-context'
import { InfoModal } from '@/components/info-modal'
import { PostSetupModal } from '@/features/home/components/post-setup-modal'
import { SettingsModal } from '@/components/SettingsModal'
import { SetupModal } from './components/setup-modal'

export default function HomePage() {
    return (
        <PopupProvider>
            <main>
                <ChallengeHero />

                {/* Modals */}
                <InfoModal />
                <SettingsModal />
                <SetupModal />
                <PostSetupModal />                
            </main>
        </PopupProvider>
    )
}
