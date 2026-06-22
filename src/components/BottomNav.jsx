import { MapIcon, Star, User } from '../icons.jsx'
import './BottomNav.css'

const ITEMS = [
  { id: 'home', label: 'Carte', Icon: MapIcon },
  { id: 'collection', label: 'Merveilles', Icon: Star },
  { id: 'profil', label: 'Profil', Icon: User },
]

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className="bottomnav">
      {ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`navbtn${active === id ? ' active' : ''}`}
          onClick={() => onNavigate(id)}
          aria-current={active === id ? 'page' : undefined}
        >
          <Icon />
          {label}
        </button>
      ))}
    </nav>
  )
}
