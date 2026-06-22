// Content for three of the four loop steps of "Les codes secrets".
// (Le jeu lives in CodesGame.jsx.) The engine wraps each in the loop chrome
// and supplies the eyebrow label; these render the heading, copy and button.
import { useState } from 'react'
import { caesar } from '../../lib/caesar.js'
import { CARDS } from '../../cards/index.js'
import { WonderCard } from '../../components/WonderCard.jsx'

// --- L'étincelle: the mysterious encrypted message ---
export function Etincelle({ session, onNext }) {
  return (
    <>
      <h2 className="h2">Le secret de Jules César</h2>
      <p className="body">
        Il y a 2000 ans, l'empereur Jules César envoyait des ordres secrets à son
        armée. Si un messager était capturé, l'ennemi tombait sur ça :
      </p>
      <div className="secret-strip">{session.enc}</div>
      <p className="body">
        Impossible à lire... sauf si on connaît l'astuce. Aujourd'hui, c'est toi
        qui vas la casser.
      </p>
      <button className="btn btn-block" onClick={onNext}>Montre-moi l'astuce</button>
    </>
  )
}

// --- L'idée: the interactive "shift the letters" demo ---
const DEMO_LETTERS = Array.from({ length: 8 }, (_, i) => String.fromCharCode(65 + i))

export function Idee({ onNext }) {
  const [shift, setShift] = useState(3)
  return (
    <>
      <h2 className="h2">Décale les lettres</h2>
      <p className="body">
        L'astuce de César : décaler chaque lettre dans l'alphabet. Bouge le
        décalage et regarde les lettres changer.
      </p>
      <div className="map-demo">
        <div className="demo-row">
          {DEMO_LETTERS.map((l) => (
            <span key={l} className="chip">{l}</span>
          ))}
        </div>
        <div className="demo-arrows">↓ ↓ ↓</div>
        <div className="demo-row">
          {DEMO_LETTERS.map((l, i) => (
            <span key={i} className="chip on">{String.fromCharCode(65 + ((i + shift) % 26))}</span>
          ))}
        </div>
        <div className="dial-mini">
          <span>Décalage</span>
          <input
            type="range" min="0" max="6" value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            aria-label="Décalage de démonstration"
          />
          <span className="dial-num">{shift}</span>
        </div>
        <div className="example-line">
          CHAT devient <span className="word-out">{caesar('CHAT', shift)}</span>
        </div>
      </div>
      <p className="body small">
        Et quand on dépasse Z ? On revient au début : ...X, Y, Z, A, B, C...
        exactement comme une horloge.
      </p>
      <button className="btn btn-block" onClick={onNext}>J'ai compris, à moi de jouer</button>
    </>
  )
}

// --- La découverte: the wonder card reveal + the door to the next world ---
export function Decouverte({ onFinish }) {
  return (
    <>
      <h2 className="h2">Une merveille pour toi !</h2>
      <WonderCard card={CARDS.cesar} pop />
      <div className="door">
        <p className="body">
          <b>Et le monde s'agrandit :</b> aujourd'hui, des codes des milliards de
          fois plus puissants protègent tous tes messages et tes jeux. Le plus
          fou ? Ils sont fabriqués avec d'immenses <b>nombres premiers</b>... et
          ça, c'est un autre monde qui t'attend.
        </p>
      </div>
      <button className="btn btn-block" onClick={onFinish}>Ajouter à ma collection</button>
    </>
  )
}
