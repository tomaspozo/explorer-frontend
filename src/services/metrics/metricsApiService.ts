import axios from 'axios'
import { METRICS_API_ENDPOINTS } from './endpoints'
import type { GithubStatsHistory, GithubStatsOverview, QubicStats } from './types'

const fetchData = async <T>(url: string): Promise<T> => {
  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data as T
  } catch (error) {
    throw new Error(`Failed to fetch data from ${url}: ${(error as Error).message}`)
  }
}

const metricsApiService = {
  getQubicStats: async (): Promise<{ data: QubicStats[] }> => {
    const url = METRICS_API_ENDPOINTS.QUBIC_STATS
    return fetchData<{ data: QubicStats[] }>(url)
  },
  getGithubStatsOverview: async (): Promise<{ data: GithubStatsOverview }> => {
    const url = METRICS_API_ENDPOINTS.GITHUB_STATS_OVERVIEW
    return fetchData<{ data: GithubStatsOverview }>(url)
  },
  getGithubStatsHistory: async (): Promise<{ data: GithubStatsHistory[] }> => {
    const url = METRICS_API_ENDPOINTS.GITHUB_STATS_HISTORY
    return fetchData<{ data: GithubStatsHistory[] }>(url)
  }
}

export default metricsApiService
