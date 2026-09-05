import { Moon, Palette, Sun } from 'lucide-react'
import { PageHeading } from '../components/ui/PageHeading'
import { useTheme, type AccentTheme } from '../components/layout/ThemeProvider'

const accents: { name: AccentTheme; label: string }[] = [
    { name: 'neutral',  label: 'Neutral' },
    { name: 'ocean',    label: 'Ocean' },
    { name: 'violet',   label: 'Violet' },
    { name: 'forest',   label: 'Forest' },
    { name: 'sunset',   label: 'Sunset' },
]

export function SettingsPage() {
    const { accent, mode, setAccent, setMode } = useTheme()

    return (
        <>
            <PageHeading title="Settings" description='Theme preference are local for the foundation build; account-backed prefernces can follow.'/>
            <div className="grid max-w-3xl gap-4">
                <section className="surface-card p-5">
                    <div className="mb-4 flex items-center gap-2"><Palette size={17} />
                    <h3 className="text-sm font-semibold">Accent theme</h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        { accents.map((item) =>(
                            <button key={item.name} onClick={() => setAccent(item.name)} className={`focus-ring rounded-xl border px-3 py-2 text-sm transition ${accent === item.name ? 'border-[rgb(var(--foreground))] bg-[rgb(var(--foreground))] text-[rgb(var(--surface))]' : 'border-[rgb(var(--border))] bg-[rgb(var(--surface-subtle))]'}`}>{item.label}</button>
                        ))}
                    </div>
                </section>

                <section className="surface-card p-5">
                    <h3 className="mb-4 text-sm font-semibold"> Appearance</h3>
                    <div className="flex gap-2">
                        <button onClick={() => setMode('light')} className={`focus-ring flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${mode=== 'light' ? 'border-[rgb(var(--foreground))]' : 'border-[rgb(var(--border))]'}`}><Sun size={16}/> Light</button>
                        <button onClick={() => setMode('dark')} className={`focus-ring flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${mode=== 'light' ? 'border-[rgb(var(--foreground))]' : 'border-[rgb(var(--border))]'}`}><Moon size={16}/>Dark</button>
                    </div>
                </section>
            </div>
        </>
    )
}