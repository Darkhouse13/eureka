// The fennec-fox guide, ported 1:1 from the prototype's fox() builder.
// `mood="happy"` swaps to curved eyes, a smile and blush; otherwise the eyes
// blink. `bob` makes it gently float. `size` picks one of the size classes.
import './Fox.css'

export default function Fox({ mood = 'neutral', size = 'md', bob = false, className = '' }) {
  const happy = mood === 'happy'
  const cls = ['fox', `fox-${size}`, bob && 'bob', className].filter(Boolean).join(' ')

  return (
    <div className={cls}>
      <svg viewBox="0 0 40 40" role="img" aria-label="Renard guide">
        {/* ears */}
        <polygon points="7,3 17,17 5,16" fill="#DBA45E" />
        <polygon points="33,3 35,16 23,17" fill="#DBA45E" />
        <polygon points="9,7 15,15 8,15" fill="#F4DFBE" />
        <polygon points="31,7 32,15 25,15" fill="#F4DFBE" />
        {/* head + muzzle */}
        <circle cx="20" cy="23" r="12" fill="#EBC591" />
        <ellipse cx="20" cy="27" rx="7.6" ry="5.6" fill="#F7E7CB" />
        {/* blush (happy only) */}
        {happy && (
          <>
            <ellipse cx="12.3" cy="27" rx="2.2" ry="1.3" fill="#F2A9B8" opacity=".85" />
            <ellipse cx="27.7" cy="27" rx="2.2" ry="1.3" fill="#F2A9B8" opacity=".85" />
          </>
        )}
        {/* eyes */}
        {happy ? (
          <>
            <path d="M13 23 q2 -2.4 4 0" fill="none" stroke="#3B2A18" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M23 23 q2 -2.4 4 0" fill="none" stroke="#3B2A18" strokeWidth="1.8" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle className="eye" cx="15.5" cy="22" r="1.7" fill="#3B2A18" />
            <circle className="eye" cx="24.5" cy="22" r="1.7" fill="#3B2A18" />
          </>
        )}
        {/* nose */}
        <circle cx="20" cy="26" r="1.7" fill="#3B2A18" />
        {/* smile (happy only) */}
        {happy && (
          <path d="M16.5 28 q3.5 3 7 0" fill="none" stroke="#3B2A18" strokeWidth="1.6" strokeLinecap="round" />
        )}
      </svg>
    </div>
  )
}
