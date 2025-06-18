import { useState, useEffect } from 'react'

interface VoucherWalletItem {
  id: string
  code: string
  brand: string
  value: number
  description: string
  expiryDate: Date
  isUsed: boolean
  category: string
  terms: string
  minSpend?: number
}

interface UseVoucherWalletProps {
  userId: string
  onVoucherUpdate?: (vouchers: VoucherWalletItem[]) => void
}

export function useVoucherWallet({ userId, onVoucherUpdate }: UseVoucherWalletProps) {
  const [vouchers, setVouchers] = useState<VoucherWalletItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserVouchers()
  }, [userId])

  const loadUserVouchers = async () => {
    setLoading(true)
    
    try {
      // Simulate Firestore fetch - replace with actual implementation
      const mockVouchers: VoucherWalletItem[] = [
        {
          id: 'v1',
          code: 'SAVE20TECH',
          brand: 'Currys PC World',
          value: 20,
          description: '£20 off electronics over £100',
          expiryDate: new Date('2024-12-31'),
          isUsed: false,
          category: 'electronics',
          terms: 'Valid on electronics over £100. Cannot be combined with other offers.',
          minSpend: 100
        },
        {
          id: 'v2',
          code: 'FASHION15',
          brand: 'Next',
          value: 15,
          description: '£15 off fashion items',
          expiryDate: new Date('2024-11-30'),
          isUsed: false,
          category: 'fashion',
          terms: 'Valid on full price items only. Excludes sale items.'
        },
        {
          id: 'v3',
          code: 'GROCERY10',
          brand: 'Tesco',
          value: 10,
          description: '£10 off your weekly shop',
          expiryDate: new Date('2024-10-15'),
          isUsed: true,
          category: 'grocery',
          terms: 'Minimum spend £50. Valid in-store and online.'
        },
        {
          id: 'v4',
          code: 'DINING25',
          brand: 'Just Eat',
          value: 25,
          description: '£25 off food delivery',
          expiryDate: new Date('2024-09-20'),
          isUsed: false,
          category: 'dining',
          terms: 'Valid on orders over £40. Delivery fees may apply.'
        }
      ]
      
      setVouchers(mockVouchers)
      onVoucherUpdate?.(mockVouchers)
    } catch (error) {
      console.error('Failed to load vouchers:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTotalValue = () => {
    return vouchers
      .filter(v => !v.isUsed && !isExpired(v))
      .reduce((sum, v) => sum + v.value, 0)
  }

  const isExpired = (voucher: VoucherWalletItem) => {
    return new Date() > voucher.expiryDate
  }

  const getDaysUntilExpiry = (voucher: VoucherWalletItem) => {
    const days = Math.ceil((voucher.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const markVoucherAsUsed = async (voucherId: string) => {
    try {
      setVouchers(prev => prev.map(v => 
        v.id === voucherId ? { ...v, isUsed: true } : v
      ))
      
      // Update Firestore in production
      // await updateDoc(doc(db, 'users', userId, 'vouchers', voucherId), { isUsed: true })
      
      return true
    } catch (error) {
      console.error('Failed to mark voucher as used:', error)
      return false
    }
  }

  const addVoucher = async (voucherData: Omit<VoucherWalletItem, 'id'>) => {
    try {
      const newVoucher: VoucherWalletItem = {
        ...voucherData,
        id: `voucher_${Date.now()}`
      }
      
      setVouchers(prev => [newVoucher, ...prev])
      onVoucherUpdate?.([newVoucher, ...vouchers])
      
      return newVoucher
    } catch (error) {
      console.error('Failed to add voucher:', error)
      return null
    }
  }

  return {
    vouchers,
    loading,
    getTotalValue,
    isExpired,
    getDaysUntilExpiry,
    markVoucherAsUsed,
    addVoucher,
    refreshVouchers: loadUserVouchers
  }
}