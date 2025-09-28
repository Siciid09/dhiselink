import Link from 'next/link';
import { FaUserTie, FaBuilding, FaLightbulb, FaUsers, FaShieldAlt, FaBullseye } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <main>
      {/* Section 1: Hero */}
      <section className="bg-slate-50">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Powering Somaliland's <br /> Professional Future.
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600">
            Dhiselink is where Somaliland's ambition meets opportunity. We are the nation's dedicated professional network, built to connect top-tier talent with leading companies, impactful projects, and career-defining roles.
          </p>
        </div>
      </section>

      {/* Section 2: Our Mission */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Mission:
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
                To Bridge the Gap
              </span>
            </h2>
          </div>
          <div className="md:col-span-2 text-gray-600 text-lg space-y-4">
            <p>
              Somaliland is rich with skilled, ambitious, and determined professionals. Yet, a gap has long existed between this incredible talent pool and the opportunities that can harness its full potential.
            </p>
            <p className="font-semibold text-gray-800">
              Dhiselink was founded on a simple, powerful belief: the right connection can change everything.
            </p>
            <p>
              Our mission is to close that gap, empowering professionals to build meaningful careers at home while enabling organizations to find the exact expertise they need to thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: The Platform */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">A Platform Engineered for Impact</h2>
            <p className="mt-4 text-lg text-gray-600">
              We provide the tools for professionals and organizations to connect with purpose and clarity. Our platform is designed to be efficient, transparent, and results-oriented.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Card for Professionals */}
            <div className="border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                <FaUserTie size={24} />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-900">For Professionals</h3>
              <p className="mt-3 text-gray-600">
                Your career journey deserves a powerful catalyst. Create a comprehensive profile, showcase your skills, and access curated opportunities from Somaliland's most innovative companies.
              </p>
            </div>
            {/* Card for Employers */}
            <div className="border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600">
                <FaBuilding size={24} />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-900">For Employers & Organizations</h3>
              <p className="mt-3 text-gray-600">
                Finding the right talent is your most critical asset. Discover qualified candidates efficiently, post opportunities to a targeted audience, and build the teams that will drive your vision forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Our Values */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">The Principles That Guide Us</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Our commitment is built on a foundation of core values that ensure we create lasting value for our community.
            </p>
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div className="flex flex-col items-center">
                <FaLightbulb className="text-yellow-500 text-4xl mb-4" />
                <h4 className="text-xl font-semibold text-gray-800">Opportunity</h4>
                <p className="mt-2 text-gray-500">Empowering every professional to reach their full potential.</p>
              </div>
              <div className="flex flex-col items-center">
                <FaUsers className="text-cyan-500 text-4xl mb-4" />
                <h4 className="text-xl font-semibold text-gray-800">Community</h4>
                <p className="mt-2 text-gray-500">A network built on collaboration, knowledge-sharing, and mutual support.</p>
              </div>
              <div className="flex flex-col items-center">
                <FaShieldAlt className="text-blue-500 text-4xl mb-4" />
                <h4 className="text-xl font-semibold text-gray-800">Integrity</h4>
                <p className="mt-2 text-gray-500">Operating with transparency and trust in a reliable environment.</p>
              </div>
              <div className="flex flex-col items-center">
                <FaBullseye className="text-red-500 text-4xl mb-4" />
                <h4 className="text-xl font-semibold text-gray-800">Impact</h4>
                <p className="mt-2 text-gray-500">Driving measurable growth for a resilient, prosperous Somaliland.</p>
              </div>
            </div>
        </div>
      </section>

      {/* Section 5: Call to Action */}
      <section className="bg-gray-900">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Join the Network Building the Future.</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Whether you are looking to hire or be hired, your next great opportunity starts here.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/register/employer" className="inline-block rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors">
              Find Talent
            </Link>
            <Link href="/opportunities" className="inline-block rounded-md bg-white px-6 py-3 text-lg font-semibold text-blue-600 shadow-sm hover:bg-gray-100 transition-colors">
              Discover Opportunities
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}