import React from 'react'

interface SavingsGoalProps {
  goalAmount?: number
  goalDescription?: string
  currentSavings?: number
  onChangeGoal?: () => void
  onBackToDashboard?: () => void
}

const SavingsGoal: React.FC<SavingsGoalProps> = ({
  goalAmount = 250,
  goalDescription = "New Garden Sofa",
  currentSavings = 106.50,
  onChangeGoal,
  onBackToDashboard
}) => {
  const progressPercentage = Math.min((currentSavings / goalAmount) * 100, 100)
  const remainingAmount = Math.max(goalAmount - currentSavings, 0)

  const handleChangeGoal = () => {
    alert('Goal settings coming soon!')
    onChangeGoal?.()
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{ 
        fontFamily: "'Segoe UI', sans-serif",
        background: "#f9f9f9"
      }}
    >
      <div 
        className="max-w-2xl mx-auto rounded-2xl p-8 text-center"
        style={{ 
          background: "white",
          boxShadow: "0 10px 20px rgba(0,0,0,0.08)"
        }}
      >
        <h1 
          className="text-3xl mb-4"
          style={{ color: "#0f766e" }}
        >
          💸 Your Savings Goal
        </h1>
        
        <p className="mb-6 text-lg">
          <strong>Goal:</strong> £{goalAmount} - {goalDescription}
        </p>
        
        {/* Progress Bar */}
        <div 
          className="rounded-xl overflow-hidden h-8 my-4"
          style={{ background: "#e0f2f1" }}
        >
          <div 
            className="h-full text-white text-left px-3 py-1 font-bold transition-all duration-500 ease-in-out"
            style={{ 
              background: "#14b8a6",
              width: `${progressPercentage}%`
            }}
          >
            £{currentSavings.toFixed(2)} Saved
          </div>
        </div>
        
        <p 
          className="my-4 text-lg"
          style={{ color: "#0f766e" }}
        >
          You're {progressPercentage.toFixed(1)}% of the way there. 
          {remainingAmount > 0 ? ` £${remainingAmount.toFixed(2)} to go!` : ' Goal achieved!'}
        </p>
        
        <p className="mb-6 text-gray-600">
          Keep hunting deals to reach your target faster!
        </p>
        
        <button 
          onClick={handleChangeGoal}
          className="py-2 px-6 text-base rounded-lg cursor-pointer transition-colors duration-200 text-white border-none mb-4"
          style={{ background: "#0f766e" }}
          onMouseOver={(e) => e.currentTarget.style.background = "#0d9488"}
          onMouseOut={(e) => e.currentTarget.style.background = "#0f766e"}
        >
          Change Goal
        </button>

        {/* Back Navigation */}
        <div className="mt-8">
          <button 
            onClick={onBackToDashboard}
            className="py-2 px-4 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default SavingsGoal