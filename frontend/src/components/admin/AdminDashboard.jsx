import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { supabase, mapJob, mapCompany, mapUser } from '@/lib/supabase'
import PageTransition from '../shared/PageTransition'
import { Briefcase, Users, CircleCheck as CheckCircle, Clock, FileText, ChartBar as BarChart3, TrendingUp, ChevronRight, MoveHorizontal as MoreHorizontal, Building2, Award } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell,
  ComposedChart, Line
} from 'recharts'

const AdminDashboard = () => {
  const { user } = useSelector(store => store.auth)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalApplicants: 0,
    accepted: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
    acceptanceRate: 0,
    recentApplications: [],
    applicationsPerJob: [],
    jobTypeDistribution: [],
    monthlyData: [],
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const [jobsRes, companiesRes] = await Promise.all([
          supabase.from('jobs').select('*, company:companies(*)').eq('created_by', session.user.id),
          supabase.from('companies').select('*').eq('user_id', session.user.id),
        ])

        const jobRows = jobsRes.data || []
        const companyRows = companiesRes.data || []
        const jobs = jobRows.map(row => mapJob(row, mapCompany(row.company), []))
        const companies = companyRows.map(row => mapCompany(row))
        let allApplicants = []
        let accepted = 0, rejected = 0, pending = 0, shortlisted = 0

        for (const job of jobs) {
          try {
            const { data: appRows, error: appError } = await supabase
              .from('applications')
              .select('*, applicant:users(*)')
              .eq('job_id', job._id)
            if (appError) continue
            const applicants = (appRows || []).map(row => ({
              _id: row.id,
              applicant: mapUser(row.applicant),
              status: row.status,
              createdAt: row.created_at,
              jobTitle: job.title
            }))
            allApplicants = [...allApplicants, ...applicants]
            applicants.forEach(app => {
              const status = app.status?.toLowerCase() || 'pending'
              if (status === 'accepted') accepted++
              else if (status === 'rejected') rejected++
              else if (status === 'shortlisted') shortlisted++
              else pending++
            })
          } catch (e) { /* skip */ }
        }

        const totalApplicants = allApplicants.length
        const acceptanceRate = totalApplicants > 0 ? Math.round((accepted / totalApplicants) * 100) : 0

        const applicationsPerJob = jobs.map(job => ({
          name: job.title.length > 15 ? job.title.substring(0, 15) + '...' : job.title,
          applicants: allApplicants.filter(a => a.jobTitle === job.title).length,
        })).filter(j => j.applicants > 0)

        const typeMap = {}
        jobs.forEach(j => {
          const type = j.jobType || 'Full-time'
          typeMap[type] = (typeMap[type] || 0) + 1
        })
        const jobTypeDistribution = Object.entries(typeMap).map(([name, value]) => ({ name, value }))

        const monthlyData = []
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const now = new Date()
        for (let i = 11; i >= 0; i--) {
          const monthIndex = (now.getMonth() - i + 12) % 12
          monthlyData.push({
            month: months[monthIndex],
            jobs: jobs.filter(j => new Date(j.createdAt).getMonth() === monthIndex).length,
            applicants: allApplicants.filter(a => new Date(a.createdAt).getMonth() === monthIndex).length,
          })
        }

        setStats({
          totalJobs: jobs.length,
          totalCompanies: companies.length,
          totalApplicants,
          accepted,
          pending,
          shortlisted,
          rejected,
          acceptanceRate,
          recentApplications: allApplicants.slice(-8).reverse(),
          applicationsPerJob,
          jobTypeDistribution,
          monthlyData,
        })
      } catch (error) {
        console.error('Dashboard fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const COLORS = ['#6A38C2', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899']

  const statCards = [
    { title: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, bg: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-600 dark:text-blue-400' },
    { title: 'Total Companies', value: stats.totalCompanies, icon: Building2, bg: 'bg-purple-50 dark:bg-purple-900/20', textColor: 'text-purple-600 dark:text-purple-400' },
    { title: 'Total Applicants', value: stats.totalApplicants, icon: Users, bg: 'bg-emerald-50 dark:bg-emerald-900/20', textColor: 'text-emerald-600 dark:text-emerald-400' },
    { title: 'Acceptance Rate', value: `${stats.acceptanceRate}%`, icon: Award, bg: 'bg-amber-50 dark:bg-amber-900/20', textColor: 'text-amber-600 dark:text-amber-400' },
  ]

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <div className="flex items-center justify-center h-[70vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6A38C2] border-t-transparent"></div>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.fullname?.split(' ')[0] || 'Recruiter'}!
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Here's what's happening with your job postings today.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button
                onClick={() => navigate('/admin/companies')}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:shadow-md transition-all"
              >
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">Companies</span>
              </button>
              <button
                onClick={() => navigate('/admin/jobs/create')}
                className="flex items-center gap-2 px-4 py-2 bg-[#6A38C2] text-white rounded-xl shadow-sm hover:bg-[#5b30a6] transition-all"
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Post New Job</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <Icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                    <TrendingUp className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
            {/* Applications per job - Bar Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Applications per Job</h3>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              {stats.applicationsPerJob.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No application data yet</p>
                  </div>
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.applicationsPerJob} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} angle={-15} textAnchor="end" height={60} />
                      <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          borderColor: '#374151',
                          color: '#fff',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="applicants" fill="#6A38C2" name="Applicants" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Job Type Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Job Types</h3>
              {stats.jobTypeDistribution.length === 0 ? (
                <div className="h-52 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                  No jobs posted yet
                </div>
              ) : (
                <>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={stats.jobTypeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {stats.jobTypeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            borderColor: '#374151',
                            color: '#fff',
                            borderRadius: '8px',
                          }}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {stats.jobTypeDistribution.map((item, i) => (
                      <span key={i} className="text-xs flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        {item.name} ({item.value})
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Monthly Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Monthly Activity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      borderColor: '#374151',
                      color: '#fff',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="jobs" fill="#6366f1" name="Jobs" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="applicants" stroke="#8b5cf6" name="Applicants" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Recent Applicants</h3>
              <button className="text-sm text-[#6A38C2] hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {stats.recentApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No applicants yet. Post a job to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    <tr>
                      <th className="text-left py-3 font-medium">Applicant</th>
                      <th className="text-left py-3 font-medium">Job</th>
                      <th className="text-left py-3 font-medium">Applied</th>
                      <th className="text-left py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentApplications.map((app, index) => {
                      const statusColor = app.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : app.status === 'rejected'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : app.status === 'shortlisted'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      return (
                        <tr key={index} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="py-3 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#6A38C2]/10 text-[#6A38C2] flex items-center justify-center text-xs font-bold">
                              {app?.applicant?.fullname?.charAt(0) || '?'}
                            </div>
                            <span className="text-gray-800 dark:text-white">{app?.applicant?.fullname || 'Unknown'}</span>
                          </td>
                          <td className="text-gray-600 dark:text-gray-300">{app.jobTitle || 'N/A'}</td>
                          <td className="text-gray-500 dark:text-gray-400">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                              {app.status?.toUpperCase() || 'PENDING'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Post New Job', icon: Briefcase, path: '/admin/jobs/create', color: 'bg-[#6A38C2] text-white' },
              { label: 'Manage Jobs', icon: FileText, path: '/admin/jobs', color: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700' },
              { label: 'View Companies', icon: Building2, path: '/admin/companies', color: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700' },
              { label: 'Dashboard', icon: BarChart3, path: '/admin/dashboard', color: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700' }
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => action.path && navigate(action.path)}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${action.color}`}
              >
                <action.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default AdminDashboard
