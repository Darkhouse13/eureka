import './BottomNav.css'

const TABS = [
  {
    id: 'map', label: 'Carte',
    icon: <path d="M9 20l-5-2V5l5 2 6-2 5 2v13l-5-2-6 2zM9 7v13M15 5v13" />,
  },
  {
    id: 'collection', label: 'Collection',
    icon: <g><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 9h16M9 4v16" /></g>,
  },
  {
    id: 'profil', label: 'Profil',
    icon: <g><circle cx="12" cy="8" r="4" /><path d="M5 20c0-4 3.5-6 7-6s7 2 7 6" /></g>,
  },
]

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className="bottomnav" aria-label="Navigation principale">
      {TABS.map((t) => {
        const on = active === t.id
        return (
          <button key={t.id} type="button" className={`navtab ${on ? 'is-active' : ''}`}
                  aria-current={on ? 'page' : undefined} onClick={() => onNavigate(t.id)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {t.icon}
            </svg>
            <span>{t.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
