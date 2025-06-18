import { useEffect, useState } from 'react'

interface VoucherItem {
  amount: number
  reason: string
  timestamp: Date
}

interface VoucherPotData {
  totalSaved: number
  vouchers: VoucherItem[]
}

interface UseVoucherPotFirestoreProps {
  userId: string
  onUpdate?: (data: VoucherPotData) => void
}

export function useVoucherPotFirestore({ userId, onUpdate }: UseVoucherPotFirestoreProps) {
  const [data, setData] = useState<VoucherPotData>({
    totalSaved: 0,
    vouchers: []
  })

  useEffect(() => {
    if (!userId) return

    // Simulate Firestore onSnapshot listener
    const simulateFirestoreListener = () => {
      const mockData: VoucherPotData = {
        totalSaved: 47.50,
        vouchers: [
          { amount: 5.00, reason: 'Review submitted', timestamp: new Date('2024-12-09') },
          { amount: 12.50, reason: 'Referral bonus', timestamp: new Date('2024-12-08') },
          { amount: 8.25, reason: 'Share reward', timestamp: new Date('2024-12-07') },
          { amount: 15.75, reason: 'Search milestone', timestamp: new Date('2024-12-06') },
          { amount: 6.00, reason: 'Streak bonus', timestamp: new Date('2024-12-05') }
        ]
      }

      setData(mockData)
      onUpdate?.(mockData)

      // Simulate periodic updates
      const updateInterval = setInterval(() => {
        const newAmount = Math.round((Math.random() * 5 + 1) * 100) / 100
        const reasons = ['Search activity', 'Review posted', 'Share completed', 'Daily bonus']
        const randomReason = reasons[Math.floor(Math.random() * reasons.length)]

        const updatedData: VoucherPotData = {
          totalSaved: mockData.totalSaved + newAmount,
          vouchers: [
            { amount: newAmount, reason: randomReason, timestamp: new Date() },
            ...mockData.vouchers
          ]
        }

        setData(updatedData)
        onUpdate?.(updatedData)
        mockData.totalSaved = updatedData.totalSaved
        mockData.vouchers = updatedData.vouchers
      }, 10000) // Update every 10 seconds

      return () => clearInterval(updateInterval)
    }

    const unsubscribe = simulateFirestoreListener()
    return unsubscribe
  }, [userId, onUpdate])

  return { data }
}