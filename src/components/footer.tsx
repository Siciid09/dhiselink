import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Dhiselink</h3>
            <p className="text-gray-600">Connecting Somaliland's talent with opportunities to build a prosperous future.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Sitemap</h4>
            <ul className="space-y-1">
              <li><Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link></li>
              <li><Link href="/professionals" className="text-gray-600 hover:text-blue-600">Professionals</Link></li>
              <li><Link href="/opportunities" className="text-gray-600 hover:text-blue-600">Opportunities</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Legal</h4>
            <ul className="space-y-1">
              <li><Link href="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Dhiselink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}