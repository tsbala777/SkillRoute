import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import RoadmapView from '../components/RoadmapView'
import CareerMatchCard from '../components/CareerMatchCard'
import AdaptiveRecommendations from '../components/AdaptiveRecommendations';
import TimelineView from '../components/TimelineView'
import ProgressTracker from '../components/ProgressTracker'
import { FloatingHeader } from '../components/ui/floating-header'
import ConfirmModal from '../components/ConfirmModal'
import { useToast } from '../contexts/ToastContext'
import { RefreshCw, RotateCcw } from 'lucide-react'
import axios from 'axios'

const Dashboard = () => {
  const [profile, setProfile] = useState(null)
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showTimeline, setShowTimeline] = useState(true)
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [showConfirmAdapt, setShowConfirmAdapt] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const handleAdaptRoadmap = async () => {
    setShowConfirmAdapt(false)
    setLoading(true)
    try {
      const token = await auth.currentUser.getIdToken()
      await axios.post(`${API_URL}/api/progress/adapt`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await loadRoadmap()
      toast.success({
        title: 'Roadmap Adapted',
        description: 'Your learning path has been updated based on your recent progress.'
      })
    } catch (error) {
      toast.error('Failed to adapt roadmap. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
    loadRoadmap()
  }, [])

  const loadProfile = async () => {
    try {
      const token = await auth.currentUser.getIdToken()
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8s timeout

      try {
        const response = await axios.get(`${API_URL}/api/students/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        })
        if (response.data && !response.data.message) {
          setProfile(response.data)
        }
      } finally {
        clearTimeout(timeoutId)
      }
    } catch (error) {
      if (error.code !== 'ECONNABORTED') {
        console.error('Profile load error:', error)
      }
    }
  }

  const loadRoadmap = async () => {
    try {
      const token = await auth.currentUser.getIdToken()
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8s timeout

      try {
        const response = await axios.get(`${API_URL}/api/career/roadmap`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        })
        if (response.data && !response.data.message) {
          setRoadmap(response.data)
        }
      } finally {
        clearTimeout(timeoutId)
      }
    } catch (error) {
      if (error.code !== 'ECONNABORTED') {
        console.error('Roadmap load error:', error)
      }
    }
  }

  const generateRoadmap = async () => {
    if (!profile) {
      navigate('/profile')
      return
    }

    setLoading(true)
    try {
      const token = await auth.currentUser.getIdToken()
      const response = await axios.post(`${API_URL}/api/career/roadmap`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRoadmap(response.data)
      toast.success('Roadmap generated successfully!')
    } catch (error) {
      toast.error('Failed to generate roadmap')
    } finally {
      setLoading(false)
    }
  }

  const resetCareerPath = async () => {
    setShowConfirmReset(false)
    setLoading(true)
    try {
      const token = await auth.currentUser.getIdToken()
      await axios.delete(`${API_URL}/api/career/roadmap`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setRoadmap(null)

      toast.success('Career path reset successfully! You can now generate a new roadmap.')
    } catch (error) {
      toast.error('Failed to reset career path. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {

    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-black dark:via-zinc-900 dark:to-black">
      <FloatingHeader
        onLogout={handleLogout}
        userName={profile?.name}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {roadmap?.career_decision && (
          <CareerMatchCard careerDecision={roadmap.career_decision} />
        )}

        {roadmap?.progress && roadmap?.learning_roadmap && (
          <AdaptiveRecommendations
            progress={roadmap.progress}
            roadmap={roadmap.learning_roadmap}
          />
        )}

        {!roadmap && (
          <div className="mt-8">
            <RoadmapView
              roadmap={null}
              onGenerate={generateRoadmap}
              loading={loading}
              onRefresh={loadRoadmap}
            />
          </div>
        )}

        {roadmap && (
          <div className="space-y-6 mt-8">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Your Career Roadmap
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Personalized path to your goals
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
                    <button
                      onClick={() => setShowTimeline(false)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${!showTimeline
                        ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                      Classic
                    </button>
                    <button
                      onClick={() => setShowTimeline(true)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${showTimeline
                        ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                      Timeline
                    </button>
                  </div>

                  <div className="w-px h-8 bg-gray-200 dark:bg-zinc-700 mx-1 hidden md:block"></div>

                  <button
                    onClick={() => setShowConfirmAdapt(true)}
                    disabled={loading}
                    className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Adapt
                  </button>

                  <button
                    onClick={() => setShowConfirmReset(true)}
                    disabled={loading}
                    className="inline-flex items-center justify-center px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all disabled:opacity-50 text-sm font-medium"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {roadmap.progress && (
              <ProgressTracker
                progress={roadmap.progress}
                phases={roadmap.learning_roadmap?.roadmap}
              />
            )}

            <div>
              {showTimeline && roadmap?.learning_roadmap ? (
                <TimelineView
                  roadmap={roadmap.learning_roadmap}
                  progress={roadmap.progress}
                />
              ) : (
                <RoadmapView
                  roadmap={roadmap}
                  onGenerate={generateRoadmap}
                  onRefresh={loadRoadmap}
                  loading={loading}
                />
              )}
            </div>
          </div>
        )}
      </main>

      <ConfirmModal
        isOpen={showConfirmReset}
        onConfirm={resetCareerPath}
        onCancel={() => setShowConfirmReset(false)}
        title="Reset Career Path?"
        message="This will delete your current roadmap, reset your progress to 0%, and clear your streak. Your profile will be saved and you can generate a new roadmap immediately."
        confirmText="Yes, Reset"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmModal
        isOpen={showConfirmAdapt}
        onConfirm={handleAdaptRoadmap}
        onCancel={() => setShowConfirmAdapt(false)}
        title="Adapt Roadmap?"
        message="This will analyze your current progress and performance to generate a more personalized learning path for you. Do you want to proceed?"
        confirmText="Yes, Adapt Path"
        cancelText="Cancel"
      />
    </div>
  )
}

export default Dashboard

