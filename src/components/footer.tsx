import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          
          {/* Brand Info */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold text-gray-900">Dhiselink</h3>
            <p className="text-gray-500 mt-1 max-w-xs">
              Connecting Somaliland's talent with opportunities.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-6 md:mb-0">
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
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Contact</h4>
              <ul className="space-y-1">
                 <li><Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact Us</Link></li>
                 <li><Link href="/help" className="text-gray-600 hover:text-blue-600">Help Center</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Socials */}
        <div className="mt-8 border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} Dhiselink. All rights reserved.
          </p>
          <div className="flex space-x-5">
            <Link href="#" aria-label="Facebook" className="text-gray-400 hover:text-gray-600">
              <FaFacebook size={20} />
            </Link>
            <Link href="#" aria-label="Twitter" className="text-gray-400 hover:text-gray-600">
              <FaTwitter size={20} />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-gray-600">
              <FaLinkedin size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}