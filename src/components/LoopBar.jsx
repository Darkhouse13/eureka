// The top bar shown during a world's 4-step loop: back button, world title,
// and the step-progress dots. Owned by the engine (WorldLoop).
import { Back } from '../icons.jsx'
import './LoopBar.css'

export default function LoopBar({ title, stepIndex, stepCount = 4, onBack }) {
  return (
    <div className="loopbar">
      <button className="iconbtn" onClick={onBack} aria-label="Retour">
        <Back />
      </button>
      <div className="lb-center">
        <span className="lb-title">{title}</span>
        <span className="lb-dots">
          {Array.from({ length: stepCount }, (_, i) => (
            <span
              key={i}
              className={`dot${i === stepIndex ? ' active' : ''}${i < stepIndex ? ' done' : ''}`}
            />
          ))}
        </span>
      </div>
      {/* spacer keeps the title centred */}
      <span className="iconbtn ghost" aria-hidden="true" />
    </div>
  )
}
