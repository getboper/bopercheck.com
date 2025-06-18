import React, { useState } from 'react'
import { audioEffects } from '../utils/audioEffects'

const AudioToggle: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(audioEffects.isAudioEnabled())

  const toggleAudio = () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    audioEffects.setEnabled(newState)
    
    if (newState) {
      // Play test sound when enabling
      audioEffects.playCoinDrop()
    }
  }

  return (
    <button
      onClick={toggleAudio}
      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-200"
      style={{
        background: isEnabled ? "#dcfce7" : "#fee2e2",
        color: isEnabled ? "#166534" : "#dc2626",
        border: `1px solid ${isEnabled ? "#bbf7d0" : "#fecaca"}`
      }}
      title={`Audio feedback is ${isEnabled ? 'enabled' : 'disabled'}`}
    >
      <span className="text-base">
        {isEnabled ? "🔊" : "🔇"}
      </span>
      <span className="font-medium">
        {isEnabled ? "Audio On" : "Audio Off"}
      </span>
    </button>
  )
}

export default AudioToggle