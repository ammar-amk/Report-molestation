import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Safe Reporting, <span className="text-portal-blue">Confidential Process</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Report incidents and concerns securely and confidentially. Your voice matters, and your safety is our priority.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/report')}
              className="bg-portal-blue text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-lg"
            >
              File a Report
            </button>
            <button
              onClick={() => navigate('/admin-login')}
              className="bg-white text-portal-blue border-2 border-portal-blue px-8 py-3.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Staff Portal
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why Report Here?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-portal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fully Confidential</h3>
              <p className="text-gray-600">Your report is protected with industry-standard encryption and security measures.</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-portal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-600">Simple form-based reporting that takes just a few minutes to complete.</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-portal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Immediate Action</h3>
              <p className="text-gray-600">Reports are promptly reviewed by authorized personnel for swift resolution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-portal-blue text-white font-bold text-lg">1</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Submit Your Report</h3>
                <p className="text-gray-600">Provide details about the incident. Be as specific as you can, but you can remain anonymous if you prefer.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-portal-blue text-white font-bold text-lg">2</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Processing</h3>
                <p className="text-gray-600">Your report is encrypted and stored securely. Only authorized personnel can access it.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-portal-blue text-white font-bold text-lg">3</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Investigation</h3>
                <p className="text-gray-600">The appropriate team reviews and investigates your report according to protocol.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-portal-blue text-white font-bold text-lg">4</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Resolution</h3>
                <p className="text-gray-600">Appropriate action is taken. You will be informed of outcomes where possible while maintaining confidentiality.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-portal-blue text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Report?</h2>
          <p className="text-xl text-blue-100 mb-8">Your report matters. Take the first step towards resolution today.</p>
          <button
            onClick={() => navigate('/report')}
            className="bg-white text-portal-blue px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            File a Report Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 Confidential Incident Reporting Portal. All rights reserved.</p>
          <p className="text-sm mt-2">This portal is protected by strict confidentiality protocols.</p>
        </div>
      </footer>
    </div>
  )
}
