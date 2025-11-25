import React, { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, MapPin, Briefcase, Clock, DollarSign, RefreshCw, AlertCircle } from 'lucide-react'
import Jobcard from '../../components/Dashboard/Jobcard'
import axiosInstance from '../../api/axiosInstance'

const RecommendationJob = () => {
  const [recommendations, setRecommendations] = useState([])
  const [userPreferences, setUserPreferences] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchRecommendations = async () => {
    try {
      setError(null)
      const response = await axiosInstance.get('/job/recommendations?limit=20')
      
      if (response.data.success) {
        setRecommendations(response.data.recommendations || [])
        setUserPreferences(response.data.userPreferences || null)
      } else {
        setError(response.data.message || 'Failed to fetch recommendations')
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err)
      setError(err.response?.data?.message || 'Failed to fetch job recommendations')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchRecommendations()
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-NP').format(salary)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Job Recommendations</h1>
                <p className="text-gray-600">Personalized job suggestions based on your work history</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* User Preferences Section */}
          {userPreferences && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Your Job Preferences</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Top Categories */}
                {userPreferences.topCategories && userPreferences.topCategories.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Preferred Categories</h3>
                    <div className="flex flex-wrap gap-1">
                      {userPreferences.topCategories.map((category, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferred Locations */}
                {userPreferences.preferredLocations && userPreferences.preferredLocations.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-medium text-green-900 mb-2">Preferred Locations</h3>
                    <div className="flex flex-wrap gap-1">
                      {userPreferences.preferredLocations.map((location, index) => (
                        <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md">
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferred Job Types */}
                {userPreferences.preferredJobTypes && userPreferences.preferredJobTypes.length > 0 && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-medium text-orange-900 mb-2">Preferred Job Types</h3>
                    <div className="flex flex-wrap gap-1">
                      {userPreferences.preferredJobTypes.map((jobType, index) => (
                        <span key={index} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-md">
                          {jobType}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Average Salary */}
                {userPreferences.averageSalary > 0 && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-medium text-purple-900 mb-2">Average Salary</h3>
                    <div className="flex items-center gap-1">
                     
                      <span className="text-sm font-medium text-purple-800">
                        Rs {formatSalary(userPreferences.averageSalary)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Recommendations Section */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 text-gray-600">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Loading personalized recommendations...</span>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-3 text-red-600">
                <AlertCircle className="w-8 h-8" />
                <div>
                  <p className="font-medium">Failed to load recommendations</p>
                  <p className="text-sm text-gray-600 mt-1">{error}</p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-3 text-gray-600">
                <Sparkles className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium">No recommendations available</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Complete some jobs to get personalized recommendations
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recommended Jobs ({recommendations.length})
                </h2>
                <span className="text-sm text-gray-500">
                  Sorted by relevance to your preferences
                </span>
              </div>
              <Jobcard 
                jobs={recommendations} 
                loading={false} 
                error={null} 
                getStatusBadgeClass={getStatusBadgeClass}
              />
            </div>
          )}
        </div>

        {/* Additional Info */}
        {recommendations.length > 0 && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">How recommendations work</h3>
                <p className="text-sm text-blue-800">
                  These recommendations are based on your past job history, including categories, locations, 
                  job types, and salary preferences. The algorithm considers multiple factors to suggest 
                  the most relevant opportunities for you.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecommendationJob