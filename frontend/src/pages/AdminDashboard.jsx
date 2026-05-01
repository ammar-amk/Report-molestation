import { useEffect, useState } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import PanicButton from '../components/PanicButton'

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

const PRIORITY_COLORS = {
  urgent: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-gray-100 text-gray-700',
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
]

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

function StatCard({ label, value, colorClass, icon }) {
  return (
    <div className={`bg-white rounded-lg shadow p-5 flex items-center gap-4 border-l-4 ${colorClass}`}>
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

function Badge({ value, colorMap, labelMap }) {
  const cls = colorMap[value] || 'bg-gray-100 text-gray-700'
  const label = labelMap ? labelMap[value] : value
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>
      {label || value}
    </span>
  )
}

const STATUS_LABELS = {
  new: 'New',
  under_review: 'Under Review',
  resolved: 'Resolved',
  rejected: 'Rejected',
}

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [noteError, setNoteError] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    setError(null)
    try {
      const [compRes, statsRes] = await Promise.all([
        api.get('/complaints/'),
        api.get('/dashboard/stats/'),
      ])
      setComplaints(compRes.data)
      setStats(statsRes.data)
    } catch (err) {
      setError('Failed to load data. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const fetchDetail = async (id) => {
    try {
      const res = await api.get(`/complaints/${id}/`)
      setSelected(res.data)
      setNoteText('')
      setNoteError(null)
    } catch {
      alert('Could not load complaint details.')
    }
  }

  const updateComplaint = async (field, value) => {
    if (!selected) return
    try {
      const res = await api.patch(`/complaints/${selected.id}/`, { [field]: value })
      setSelected(res.data)
      setComplaints((prev) => prev.map((c) => c.id === res.data.id ? { ...c, [field]: value } : c))
    } catch {
      alert('Update failed.')
    }
  }

  const addNote = async () => {
    if (!noteText.trim()) return
    setSaving(true)
    setNoteError(null)
    try {
      await api.post('/notes/', { complaint: selected.id, note: noteText })
      const res = await api.get(`/complaints/${selected.id}/`)
      setSelected(res.data)
      setNoteText('')
    } catch {
      setNoteError('Failed to save note.')
    } finally {
      setSaving(false)
    }
  }

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Reporter Type', 'Accused Name', 'Department', 'Status', 'Priority']
    const rows = complaints.map((c) => [
      c.id,
      new Date(c.created_at).toLocaleDateString(),
      c.reporter_type,
      `"${c.accused_name}"`,
      `"${c.department}"`,
      c.status,
      c.priority,
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cases.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = complaints.filter((c) => {
    const matchSearch =
      !search ||
      c.accused_name?.toLowerCase().includes(search.toLowerCase()) ||
      String(c.id).includes(search) ||
      c.department?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-portal-blue">Case Management Dashboard</h1>
            <div className="flex gap-2">
              <button
                onClick={fetchAll}
                className="border border-portal-blue text-portal-blue px-4 py-2 rounded hover:bg-blue-50 text-sm font-medium"
              >
                🔄 Refresh
              </button>
              <button
                onClick={exportCSV}
                className="bg-portal-blue text-white px-4 py-2 rounded hover:bg-blue-900 text-sm font-medium"
              >
                ⬇ Export CSV
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <StatCard label="Total Cases" value={stats.total} icon="📁" colorClass="border-gray-400" />
              <StatCard label="New" value={stats.new} icon="🆕" colorClass="border-blue-500" />
              <StatCard label="Under Review" value={stats.under_review} icon="🔍" colorClass="border-yellow-400" />
              <StatCard label="Resolved" value={stats.resolved} icon="✅" colorClass="border-green-500" />
              <StatCard label="Rejected" value={stats.rejected} icon="❌" colorClass="border-red-500" />
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Search by ID, name, department…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-portal-blue"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-portal-blue"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {loading && <p className="text-gray-500 text-sm py-8 text-center">Loading cases…</p>}
          {error && <p className="text-red-500 text-sm py-4 text-center">{error}</p>}

          {!loading && !error && (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-portal-blue text-white">
                  <tr>
                    {['Case ID', 'Date', 'Reporter Type', 'Accused Name', 'Department', 'Status', 'Priority', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-8 text-gray-400">No cases found.</td></tr>
                  )}
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-gray-600">#{c.id}</td>
                      <td className="px-4 py-3 text-gray-600">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 capitalize">{c.reporter_type}</td>
                      <td className="px-4 py-3">{c.accused_name}</td>
                      <td className="px-4 py-3 text-gray-600">{c.department}</td>
                      <td className="px-4 py-3">
                        <Badge value={c.status} colorMap={STATUS_COLORS} labelMap={STATUS_LABELS} />
                      </td>
                      <td className="px-4 py-3">
                        <Badge value={c.priority} colorMap={PRIORITY_COLORS} labelMap={PRIORITY_LABELS} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => fetchDetail(c.id)}
                          className="bg-portal-blue text-white px-3 py-1 rounded text-xs hover:bg-blue-900 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="bg-portal-blue px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-white font-bold text-lg">Case #{selected.id}</h2>
              <button onClick={() => setSelected(null)} className="text-white hover:text-blue-200 text-xl font-bold">✕</button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Reporter Type', selected.reporter_type],
                  ['Reporter Name', selected.reporter_name || '—'],
                  ['Contact', selected.contact || '—'],
                  ['Matric/Staff ID', selected.matric_or_staff_id || '—'],
                  ['Accused Name', selected.accused_name],
                  ['Accused Type', selected.accused_type],
                  ['Department', selected.department],
                  ['Location', selected.location],
                  ['Incident Date', selected.incident_date],
                  ['Submitted', new Date(selected.created_at).toLocaleString()],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-gray-400 text-xs uppercase tracking-wide">{label}</p>
                    <p className="text-gray-800 font-medium capitalize">{val}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Description</p>
                <p className="text-gray-700 bg-gray-50 rounded p-3">{selected.description}</p>
              </div>

              {selected.witnesses && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Witnesses</p>
                  <p className="text-gray-700">{selected.witnesses}</p>
                </div>
              )}

              {selected.evidence_file && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Evidence</p>
                  <a
                    href={selected.evidence_file}
                    target="_blank"
                    rel="noreferrer"
                    className="text-portal-blue underline"
                  >
                    View File
                  </a>
                </div>
              )}

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wide block mb-1">Status</label>
                  <select
                    value={selected.status}
                    onChange={(e) => updateComplaint('status', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-portal-blue"
                  >
                    {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wide block mb-1">Priority</label>
                  <select
                    value={selected.priority}
                    onChange={(e) => updateComplaint('priority', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-portal-blue"
                  >
                    {PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Case Notes</p>
                {selected.notes && selected.notes.length > 0 ? (
                  <ul className="space-y-2 mb-3">
                    {selected.notes.map((n) => (
                      <li key={n.id} className="bg-gray-50 rounded p-3 text-xs">
                        <p className="text-gray-500 mb-1">
                          {n.officer_username} · {new Date(n.created_at).toLocaleString()}
                        </p>
                        <p className="text-gray-800">{n.note}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-xs italic mb-3">No notes yet.</p>
                )}

                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a case note…"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-portal-blue"
                />
                {noteError && <p className="text-red-500 text-xs mt-1">{noteError}</p>}
                <button
                  onClick={addNote}
                  disabled={saving || !noteText.trim()}
                  className="mt-2 bg-portal-blue text-white px-4 py-2 rounded text-sm hover:bg-blue-900 disabled:opacity-60 transition-colors"
                >
                  {saving ? 'Saving…' : 'Add Note'}
                </button>
              </div>
            </div>

            <div className="px-6 pb-6 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <PanicButton />
    </>
  )
}
