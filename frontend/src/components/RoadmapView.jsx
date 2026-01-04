import { useState } from 'react'
import axios from 'axios'
import { auth } from '../firebase'
import ProgressTracker from './ProgressTracker'
import { CheckCircle2, RefreshCw, Sparkles, RotateCcw, Clock, Square, CheckSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '../contexts/ToastContext'

const RoadmapView = ({ roadmap, onGenerate, onRefresh, loading }) => {
  const [updating, setUpdating] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const toast = useToast()

  const handlePhaseToggle = async (index, currentStatus) => {
    setUpdating(true)
    try {
      const token = await auth.currentUser.getIdToken()
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'

      await axios.post(`${API_URL}/api/progress/update`, {
        phase_index: index,
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      onRefresh()
    } catch (error) {
      toast.error('Failed to update progress')
    } finally {
      setUpdating(false)
    }
  }

  if (!roadmap) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800 p-8 sm:p-10 text-center"
        >
          <div className="inline-flex p-3 bg-gray-100 dark:bg-zinc-800 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-gray-900 dark:text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Start Your Journey
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Generate a personalized career roadmap based on your skills and goals.
          </p>
          <button
            onClick={onGenerate}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all disabled:opacity-50 font-medium text-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Roadmap
              </>
            )}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {roadmap.learning_roadmap && roadmap.learning_roadmap.roadmap && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden"
        >
          <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Learning Path
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                <span>{roadmap.learning_roadmap.duration_months}mo</span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {roadmap.learning_roadmap.roadmap.map((phase, index) => {
                const isCompleted = phase.status === 'completed';
                const isLast = index === roadmap.learning_roadmap.roadmap.length - 1;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.05 }}
                    className="relative flex gap-3 sm:gap-4 pl-8 sm:pl-10"
                  >
                    {!isLast && (
                      <div className="absolute w-px bg-gray-200 dark:bg-zinc-700 left-3 top-3 -bottom-6 sm:left-4 sm:top-4 sm:-bottom-8" />
                    )}

                    <button
                      onClick={() => handlePhaseToggle(index, phase.status)}
                      disabled={updating}
                      className={`absolute left-0 flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> : index + 1}
                    </button>

                    <div className={`flex-1 p-3 sm:p-4 rounded-xl border ${isCompleted
                      ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-900/30'
                      : 'bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700'
                      }`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-sm sm:text-base font-semibold ${isCompleted ? 'text-emerald-800 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                            {phase.phase}
                          </h4>
                          {isCompleted && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold uppercase">
                              Done
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <button
                            onClick={() => handlePhaseToggle(index, phase.status)}
                            disabled={updating}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors group"
                          >
                            <span className="text-[10px] uppercase font-medium text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                              {isCompleted ? 'Completed' : 'Mark Done'}
                            </span>
                            {isCompleted ? (
                              <CheckSquare className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-300 dark:text-zinc-600 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors" />
                            )}
                          </button>
                          {phase.duration && (
                            <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                              {phase.duration}
                            </span>
                          )}
                        </div>
                      </div>

                      {phase.focus_skills && phase.focus_skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {phase.focus_skills.slice(0, 6).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded text-xs bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {phase.focus_skills.length > 6 && (
                            <span className="text-xs text-gray-400 self-center px-1">
                              +{phase.focus_skills.length - 6}
                            </span>
                          )}
                        </div>
                      )}

                      {phase.outcomes && phase.outcomes.length > 0 && (
                        <ul className="space-y-1.5">
                          {phase.outcomes.slice(0, 4).map((outcome, idx) => (
                            <li key={idx} className="flex items-start text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              <span className="mr-2 text-gray-300 dark:text-zinc-600 mt-1.5">•</span>
                              <span className="leading-relaxed">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default RoadmapView
