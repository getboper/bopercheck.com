import React, { useState, useEffect } from 'react'

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

interface PDFUnlockSystemProps {
  userVoucherBalance: number
  onUnlockPDF?: (pdfId: string, cost: number) => void
  onEarnCredits?: () => void
}

const PDFUnlockSystem: React.FC<PDFUnlockSystemProps> = ({ 
  userVoucherBalance, 
  onUnlockPDF,
  onEarnCredits 
}) => {
  const [pdfs, setPDFs] = useState<PDFDocument[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUnlockModal, setShowUnlockModal] = useState<string | null>(null)

  useEffect(() => {
    loadPDFLibrary()
  }, [])

  const loadPDFLibrary = () => {
    // Mock PDF library - replace with actual data
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
  }

  const getFilteredPDFs = () => {
    return pdfs.filter(pdf => 
      selectedCategory === 'all' || pdf.category === selectedCategory
    )
  }

  const handleUnlockPDF = (pdfId: string) => {
    const pdf = pdfs.find(p => p.id === pdfId)
    if (!pdf) return

    if (userVoucherBalance >= pdf.unlockCost) {
      setPDFs(prev => prev.map(p => 
        p.id === pdfId ? { ...p, isUnlocked: true } : p
      ))
      onUnlockPDF?.(pdfId, pdf.unlockCost)
      setShowUnlockModal(null)
    }
  }

  const handleDownloadPDF = (pdf: PDFDocument) => {
    if (pdf.isUnlocked && pdf.downloadUrl) {
      // Trigger download
      const link = document.createElement('a')
      link.href = pdf.downloadUrl
      link.download = `${pdf.title.replace(/\s+/g, '-').toLowerCase()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const categories = ['all', 'guides', 'tutorials', 'seasonal', 'reports']

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: "#0f172a" }}>
          Premium Content Library 📚
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="text-lg font-bold"
            style={{ color: "#059669" }}
          >
            Your Balance: £{userVoucherBalance}
          </div>
          <button
            onClick={onEarnCredits}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Earn More Credits
          </button>
        </div>
        <p className="text-gray-600">
          Unlock premium guides and reports using your voucher pot credits
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* PDF Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredPDFs().map(pdf => (
          <div
            key={pdf.id}
            className={`rounded-xl p-6 border-2 transition-all ${
              pdf.isUnlocked
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg'
            }`}
          >
            {/* PDF Icon & Status */}
            <div className="flex justify-between items-start mb-4">
              <div className="text-4xl">📄</div>
              <div className="flex flex-col items-end">
                {pdf.isUnlocked ? (
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    ✅ Unlocked
                  </div>
                ) : (
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    🔒 £{pdf.unlockCost}
                  </div>
                )}
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="font-bold text-lg mb-2" style={{ color: "#0f172a" }}>
              {pdf.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {pdf.description}
            </p>

            {/* PDF Details */}
            <div className="space-y-2 mb-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Pages:</span>
                <span>{pdf.totalPages} ({pdf.previewPages} preview)</span>
              </div>
              <div className="flex justify-between">
                <span>Size:</span>
                <span>{pdf.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="capitalize">{pdf.category}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {pdf.isUnlocked ? (
                <button
                  onClick={() => handleDownloadPDF(pdf)}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Download PDF
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowUnlockModal(pdf.id)}
                    disabled={userVoucherBalance < pdf.unlockCost}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      userVoucherBalance >= pdf.unlockCost
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {userVoucherBalance >= pdf.unlockCost
                      ? `Unlock for £${pdf.unlockCost}`
                      : `Need £${pdf.unlockCost - userVoucherBalance} more`
                    }
                  </button>
                  <button className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                    Preview ({pdf.previewPages} pages)
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Unlock Confirmation Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            {(() => {
              const pdf = pdfs.find(p => p.id === showUnlockModal)
              if (!pdf) return null
              
              return (
                <>
                  <h3 className="text-xl font-bold mb-4" style={{ color: "#0f172a" }}>
                    Unlock "{pdf.title}"?
                  </h3>
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span>Cost:</span>
                      <span className="font-bold">£{pdf.unlockCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Balance:</span>
                      <span>£{userVoucherBalance}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>After Purchase:</span>
                      <span className="font-bold">£{userVoucherBalance - pdf.unlockCost}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowUnlockModal(null)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUnlockPDF(showUnlockModal)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Unlock Now
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* How to Earn Credits */}
      <div className="mt-12 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-3" style={{ color: "#0f172a" }}>
          How to Earn Credits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎥</div>
            <div>
              <div className="font-medium">Video Reviews</div>
              <div className="text-gray-600">£3 per review</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl">📱</div>
            <div>
              <div className="font-medium">Social Shares</div>
              <div className="text-gray-600">£2 per share</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl">🤝</div>
            <div>
              <div className="font-medium">Referrals</div>
              <div className="text-gray-600">£5 per friend</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PDFUnlockSystem