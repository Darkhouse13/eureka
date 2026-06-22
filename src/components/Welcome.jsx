// First-run screen: name the fox. The name is the only personal input and is
// stored locally. Also reachable from Profil to rename the guide.
import { useState } from 'react'
import { useApp } from '../state/AppContext.jsx'
import Fox from './Fox.jsx'

export default function Welcome({ onDone }) {
  const { foxName, setFoxName } = useApp()
  const [val, setVal] = useState(foxName || '')

  const start = () => {
    setFoxName(val.trim() || 'Filou')
    onDone()
  }

  return (
    <section className="screen welcome-screen">
      <div className="center-col">
        <Fox size="xl" bob />
        <h1 className="title">Eurêka</h1>
        <p className="lead">
          Salut ! Moi, c'est ton guide pour explorer les maths comme un monde à
          découvrir. Comment veux-tu m'appeler ?
        </p>
        <input
          className="field" type="text" maxLength={14} placeholder="Filou"
          autoComplete="off" aria-label="Le nom de ton guide"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') start() }}
        />
        <button className="btn btn-block" onClick={start}>C'est parti !</button>
      </div>
    </section>
  )
}
