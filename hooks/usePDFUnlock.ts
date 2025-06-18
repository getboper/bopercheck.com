import { useState, useEffect } from 'react'

interface PDFDocument {
  id: string
  title: string
  description: string
  category: string
  fileSize: string
  unlockCost: number
  previewPages: number
  totalPages: number
  isUnlocked: boolean
  downloadUrl?: string
}

interface UsePDFUnlockProps {
  userId: string
  userBalance: number
  onBalanceUpdate?: (newBalance: number) => void
}

export function usePDFUnlock({ userId, userBalance, onBalanceUpdate }: UsePDFUnlockProps) {
  const [pdfs, setPDFs] = useState<PDFDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPDFLibrary()
  }, [userId])

  const loadPDFLibrary = async () => {
    setLoading(true)
    
    try {
      // Simulate Firestore fetch - replace with actual implementation
      const mockPDFs: PDFDocument[] = [
        {
          id: 'pdf1',
          title: 'Ultimate Price Comparison Guide',
          description: 'Complete guide to finding the best deals online with advanced comparison techniques.',
          category: 'guides',
          fileSize: '2.4 MB',
          unlockCost: 5,
          previewPages: 3,
          totalPages: 24,
          isUnlocked: false,
          downloadUrl: '/downloads/price-comparison-guide.pdf'
        },
        {
          id: 'pdf2',
          title: 'Voucher Hunting Masterclass',
          description: 'Professional strategies for finding and maximizing voucher savings.',
          category: 'tutorials',
          fileSize: '1.8 MB',
          unlockCost: 3,
          previewPages: 2,
          totalPages: 18,
          isUnlocked: true,
          downloadUrl: '/downloads/voucher-hunting.pdf'
        },
        {
          id: 'pdf3',
          title: 'Black Friday Shopping Strategy',
          description: 'Insider tips for maximizing savings during major sale events.',
          category: 'seasonal',
          fileSize: '3.1 MB',
          unlockCost: 7,
          previewPages: 4,
          totalPages: 32,
          isUnlocked: false,
          downloadUrl: '/downloads/black-friday-strategy.pdf'
        },
        {
          id: 'pdf4',
          title: 'Cashback Optimization Report',
          description: 'Data-driven analysis of the best cashback opportunities.',
          category: 'reports',
          fileSize: '1.2 MB',
          unlockCost: 4,
          previewPages: 2,
          totalPages: 15,
          isUnlocked: false,
          downloadUrl: '/downloads/cashback-report.pdf'
        }
      ]
      
      setPDFs(mockPDFs)
    } catch (error) {
      console.error('Failed to load PDF library:', error)
    } finally {
      setLoading(false)
    }
  }

  const unlockPDF = async (pdfId: string): Promise<boolean> => {
    const pdf = pdfs.find(p => p.id === pdfId)
    if (!pdf) return false

    if (userBalance < pdf.unlockCost) {
      return false
    }

    try {
      // Update local state
      setPDFs(prev => prev.map(p => 
        p.id === pdfId ? { ...p, isUnlocked: true } : p
      ))

      // Update user balance
      const newBalance = userBalance - pdf.unlockCost
      onBalanceUpdate?.(newBalance)

      // Update Firestore in production
      // await updateDoc(doc(db, 'users', userId), { 
      //   voucherBalance: newBalance,
      //   unlockedPDFs: arrayUnion(pdfId)
      // })

      return true
    } catch (error) {
      console.error('Failed to unlock PDF:', error)
      return false
    }
  }

  const downloadPDF = async (pdf: PDFDocument): Promise<boolean> => {
    if (!pdf.isUnlocked || !pdf.downloadUrl) {
      return false
    }

    try {
      // Create download link
      const link = document.createElement('a')
      link.href = pdf.downloadUrl
      link.download = `${pdf.title.replace(/\s+/g, '-').toLowerCase()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      return true
    } catch (error) {
      console.error('Failed to download PDF:', error)
      return false
    }
  }

  const getFilteredPDFs = (category: string) => {
    return pdfs.filter(pdf => 
      category === 'all' || pdf.category === category
    )
  }

  const getUnlockedCount = () => {
    return pdfs.filter(pdf => pdf.isUnlocked).length
  }

  const getTotalUnlockCost = () => {
    return pdfs
      .filter(pdf => !pdf.isUnlocked)
      .reduce((sum, pdf) => sum + pdf.unlockCost, 0)
  }

  return {
    pdfs,
    loading,
    unlockPDF,
    downloadPDF,
    getFilteredPDFs,
    getUnlockedCount,
    getTotalUnlockCost,
    refreshLibrary: loadPDFLibrary
  }
}