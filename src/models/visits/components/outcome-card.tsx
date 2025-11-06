import { OutcomeValue } from '../types'

interface OutcomeCardProps {
  title: string
  outcome?: OutcomeValue
  onCompletedClick: () => void
  onNotCompletedClick: () => void
  disabled?: boolean
}

export function OutcomeCard({ 
  title, 
  outcome, 
  onCompletedClick, 
  onNotCompletedClick,
  disabled = false
}: OutcomeCardProps) {
  const getButtonClassName = (buttonOutcome: OutcomeValue) => {
    const baseClasses = "flex justify-center items-center rounded-full border transition-colors px-6 py-2 font-medium"
    const isSelected = outcome === buttonOutcome
    
    if (disabled) {
      return `${baseClasses} bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed`
    }
    
    if (isSelected) {
      return `${baseClasses} bg-purple-600 text-white border-purple-600`
    }
    
    return `${baseClasses} bg-white text-gray-900 border-gray-400 hover:bg-gray-50`
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500">Outcome:</p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={onCompletedClick}
            disabled={disabled}
            className={getButtonClassName('completed')}
          >
            Completed
          </button>
          
          <button
            onClick={onNotCompletedClick}
            disabled={disabled}
            className={getButtonClassName('not-completed')}
          >
            Not Completed
          </button>
        </div>
      </div>
    </div>
  )
}
