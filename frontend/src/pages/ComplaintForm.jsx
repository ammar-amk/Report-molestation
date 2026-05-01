import { useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import PanicButton from '../components/PanicButton'

export default function ComplaintForm() {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const reporterType = watch('reporter_type', 'student')

  const onSubmit = async (data) => {
    setSubmitting(true)
    setErrorMsg(null)
    setSuccess(null)

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'evidence_file') {
        if (value && value[0]) formData.append(key, value[0])
      } else if (key === 'consent') {
        formData.append(key, value ? 'true' : 'false')
      } else {
        formData.append(key, value ?? '')
      }
    })

    try {
      const res = await api.post('/complaints/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSuccess(res.data.id)
      reset()
    } catch (err) {
      const detail = err.response?.data
      if (detail && typeof detail === 'object') {
        const messages = Object.entries(detail)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join(' | ')
        setErrorMsg(messages)
      } else {
        setErrorMsg('Submission failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-portal-blue text-sm'
  const labelClass = 'block text-portal-blue font-medium mb-1 text-sm'
  const errorClass = 'text-red-500 text-xs mt-1'

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-portal-blue px-6 py-5">
              <h1 className="text-white text-2xl font-bold">Submit Confidential Report</h1>
              <p className="text-blue-200 text-sm mt-1">
                Your identity is protected. Reports are reviewed only by authorized personnel.
              </p>
            </div>

            {success && (
              <div className="mx-6 mt-6 bg-green-50 border border-green-300 rounded p-4">
                <p className="text-green-800 font-semibold">Report submitted successfully!</p>
                <p className="text-green-700 text-sm mt-1">
                  Case Reference: <span className="font-bold">#CASE-{success}</span>
                </p>
                <p className="text-green-600 text-xs mt-2">Please save this reference number for follow-up.</p>
              </div>
            )}

            {errorMsg && (
              <div className="mx-6 mt-6 bg-red-50 border border-red-300 rounded p-4">
                <p className="text-red-700 text-sm">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {/* Reporter Type */}
              <div>
                <label className={labelClass}>Reporter Type *</label>
                <select
                  className={inputClass}
                  {...register('reporter_type', { required: 'Required' })}
                >
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                  <option value="anonymous">Anonymous</option>
                </select>
              </div>

              {/* Name & ID — hidden if anonymous */}
              {reporterType !== 'anonymous' && (
                <>
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Your full name"
                      {...register('reporter_name')}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Matric / Staff ID</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. A12345 or STF001"
                      {...register('matric_or_staff_id')}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone / Email Contact</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="For follow-up (optional)"
                      {...register('contact')}
                    />
                  </div>
                </>
              )}

              {/* Accused */}
              <div>
                <label className={labelClass}>Accused Person Name *</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Full name of the accused"
                  {...register('accused_name', { required: 'Accused name is required' })}
                />
                {errors.accused_name && <p className={errorClass}>{errors.accused_name.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Accused Type *</label>
                <select
                  className={inputClass}
                  {...register('accused_type', { required: 'Required' })}
                >
                  <option value="">Select...</option>
                  <option value="staff">Staff</option>
                  <option value="student">Student</option>
                </select>
                {errors.accused_type && <p className={errorClass}>{errors.accused_type.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Department / Unit *</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Faculty of Engineering"
                  {...register('department', { required: 'Department is required' })}
                />
                {errors.department && <p className={errorClass}>{errors.department.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Incident Date *</label>
                <input
                  type="date"
                  className={inputClass}
                  max={new Date().toISOString().split('T')[0]}
                  {...register('incident_date', { required: 'Date is required' })}
                />
                {errors.incident_date && <p className={errorClass}>{errors.incident_date.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Location *</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Where did the incident occur?"
                  {...register('location', { required: 'Location is required' })}
                />
                {errors.location && <p className={errorClass}>{errors.location.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Detailed Description *</label>
                <textarea
                  rows={5}
                  className={inputClass}
                  placeholder="Describe the incident in detail (minimum 50 characters)"
                  {...register('description', {
                    required: 'Description is required',
                    minLength: { value: 50, message: 'Please provide at least 50 characters' },
                  })}
                />
                {errors.description && <p className={errorClass}>{errors.description.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Witnesses (optional)</label>
                <textarea
                  rows={3}
                  className={inputClass}
                  placeholder="Names of any witnesses (if known)"
                  {...register('witnesses')}
                />
              </div>

              <div>
                <label className={labelClass}>Upload Evidence (optional)</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.mp4"
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-portal-blue file:text-white hover:file:bg-blue-900 cursor-pointer"
                  {...register('evidence_file')}
                />
                <p className="text-gray-400 text-xs mt-1">Accepted: JPG, PNG, PDF, MP4 (max 5 MB)</p>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  className="mt-1"
                  {...register('consent', { required: 'You must consent to proceed' })}
                />
                <label htmlFor="consent" className="text-sm text-gray-700">
                  I consent to this report being reviewed by authorized personnel *
                </label>
              </div>
              {errors.consent && <p className={errorClass}>{errors.consent.message}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-portal-blue text-white py-3 rounded font-semibold hover:bg-blue-900 transition-colors disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit Report Confidentially'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <PanicButton />
    </>
  )
}
