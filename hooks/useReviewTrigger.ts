import { useState, useCallback } from 'react'

export const useReviewTrigger = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchCount, setSearchCount] = useState(
    () => parseInt(localStorage.getItem('searchCount') || '0')
  )

  const trackSearchActivity = useCallback(() => {
    const newCount = searchCount + 1
    setSearchCount(newCount)
    localStorage.setItem('searchCount', newCount.toString())
    
    // Show review modal at specific milestones
    if (newCount === 3 || newCount === 5 || newCount === 10 || newCount % 15 === 0) {
      setIsModalOpen(true)
    }
  }, [searchCount])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const resetSearchCount = useCallback(() => {
    setSearchCount(0)
    localStorage.setItem('searchCount', '0')
  }, [])

  return {
    isModalOpen,
    searchCount,
    trackSearchActivity,
    closeModal,
    resetSearchCount
  }
}