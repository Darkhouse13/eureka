// Content for three of the four loop steps of "Le grand hasard".
// (Le jeu lives in Game.jsx.) The engine wraps each in the loop chrome and
// supplies the eyebrow label; these render the heading, copy and button.
import { useState } from 'react'
import { CARDS } from '../../cards/index.js'
import { WonderCard } from '../../components/WonderCard.jsx'
import { SUMS, pairsForSum } from './dice.js'

// --- L'étincelle: does chance play favourites? ---
export function Etincelle({ onNext }) {
  return (
    <>
      <h2 className="h2">Le hasard triche-t-il ?</h2>
      <p className="body">
        Quand tu lances deux dés, on dirait que tout peut arriver, complètement au
        hasard. Et pourtant, certains nombres sortent bien plus souvent que d'autres.
        Le hasard aurait-il ses chouchous ? Lançons les dés et voyons.
      </p>
      <button className="btn btn-block" onClick={onNext}>Continuer</button>
    </>
  )
}

// --- L'idée: tap a sum to see every dice pair that makes it, and how many. ---
function PairChip({ a, b }) {
  return (
    <span className="hsd-pair" aria-hidden="true">
      <span className="hsd-pip">{a}</span>
      <span className="hsd-plus">+</span>
      <span className="hsd-pip">{b}</span>
    </span>
  )
}

function WaysDemo({ onTried }) {
  const [sum, setSum] = useState(null)
  const pairs = sum == null ? [] : pairsForSum(sum)

  const choose = (s) => {
    setSum(s)
    onTried()
  }

  return (
    <div className="hsd-demo">
      <p className="hsd-demo-q">Touche une somme :</p>
      <div className="hsd-sumrow" role="group" aria-label="Choisis une somme entre 2 et 12">
        {SUMS.map((s) => (
          <button
            key={s}
            type="button"
            className={`hsd-sumbtn${sum === s ? ' on' : ''}`}
            aria-pressed={sum === s}
            onClick={() => choose(s)}
          >
            {s}
          </button>
        ))}
      </div>
      {sum != null && (
        <div className="hsd-ways" aria-live="polite">
          <p className="hsd-ways-count">
            {pairs.length === 1
              ? `Le ${sum} : une seule façon.`
              : `Le ${sum} : ${pairs.length} façons.`}
          </p>
          <div className="hsd-pairs">
            {pairs.map(([a, b]) => (
              <PairChip key={`${a}-${b}`} a={a} b={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function Idee({ onNext }) {
  const [tried, setTried] = useState(false)
  return (
    <>
      <h2 className="h2">Compter les façons</h2>
      <p className="body">
        Le secret : certaines sommes ont plus de façons d'apparaître. Pour faire 2,
        un seul moyen : 1 et 1. Pour faire 7, il y en a six : 1-6, 2-5, 3-4, 4-3,
        5-2, 6-1. Plus une somme a de façons de sortir, plus elle revient souvent.
      </p>
      <WaysDemo onTried={() => setTried(true)} />
      <button className="btn btn-block" onClick={onNext} disabled={!tried}>
        À moi de jouer
      </button>
    </>
  )
}

// --- La découverte: the dés card reveal + the door to what's next ---
export function Decouverte({ onFinish }) {
  return (
    <>
      <h2 className="h2">Une merveille pour toi !</h2>
      <WonderCard card={CARDS.des} pop />
      <div className="door">
        <p className="body">
          <b>Le hasard réserve plus fou encore :</b> dans une classe de seulement
          30 élèves, il y a de grandes chances que deux aient leur anniversaire le
          même jour. C'est le paradoxe des anniversaires — une histoire pour un autre
          jour.
        </p>
      </div>
      <button className="btn btn-block" onClick={onFinish}>Ajouter à ma collection</button>
    </>
  )
}
