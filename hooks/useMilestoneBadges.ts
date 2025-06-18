import { useEffect, useState } from 'react'

interface MilestoneData {
  title: string
  subtitle: string
  badge: string
}

interface UseMilestoneBadgesProps {
  userId: string
  totalSaved: number
  onMilestone?: (data: MilestoneData) => void
}

export function useMilestoneBadges({ userId, totalSaved, onMilestone }: UseMilestoneBadgesProps) {
  const [achievedBadges, setAchievedBadges] = useState<string[]>([])

  useEffect(() => {
    checkMilestones()
  }, [totalSaved])

  const checkMilestones = () => {
    const milestones = [
      { amount: 10, badge: 'badge10', title: '🎉 £10 Saved!', subtitle: "You've unlocked the Bronze Badge!" },
      { amount: 25, badge: 'badge25', title: '🏅 £25 Saved!', subtitle: 'Silver Saver status achieved!' },
      { amount: 50, badge: 'badge50', title: '💎 £50 Saved!', subtitle: "You're now a Gold Saver!" },
      { amount: 100, badge: 'badge100', title: '👑 £100 Saved!', subtitle: 'Platinum Saver elite status!' }
    ]

    milestones.forEach(milestone => {
      if (totalSaved >= milestone.amount && !localStorage.getItem(milestone.badge)) {
        triggerMilestone(milestone.title, milestone.subtitle, milestone.badge)
        localStorage.setItem(milestone.badge, 'true')
        setAchievedBadges(prev => [...prev, milestone.badge])
      }
    })
  }

  const triggerMilestone = (title: string, subtitle: string, badge: string) => {
    onMilestone?.({ title, subtitle, badge })
    
    // Play milestone sound effect
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Create celebratory sound
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime) // C5
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1) // E5
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2) // G5
      oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.3) // C6

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.warn('Milestone audio playback failed:', error)
    }
  }

  const getBadgeList = () => {
    const badges = []
    if (localStorage.getItem('badge10')) badges.push('🥉 Bronze')
    if (localStorage.getItem('badge25')) badges.push('🥈 Silver')
    if (localStorage.getItem('badge50')) badges.push('🥇 Gold')
    if (localStorage.getItem('badge100')) badges.push('👑 Platinum')
    return badges
  }

  return { 
    achievedBadges, 
    getBadgeList,
    checkMilestones
  }
}