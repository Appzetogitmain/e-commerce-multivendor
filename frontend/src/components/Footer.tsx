import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Footer() {
  const { config } = useAppContext();

  // Use dummy placeholder data instead of real credentials
  const appLogo = '/assets/Ecommercestoreslogo.png';
  const appName = 'Ecommerce Stores';
  const contactPhone = '+91 98765 43210';
  const contactEmail = 'support@example.com';
  const address = '123, Mall Road, Sector 15, Indore, MP, India';

  return (
    <footer className="hidden md:block w-full relative bg-[#090b09] text-neutral-300 pt-20 pb-8 font-sans overflow-hidden mt-8">
      {/* Wave top border shape - curve smile effect mask */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 md:h-12 text-white"
          preserveAspectRatio="none"
        >
          <path d="M0 0H1440V40C1080 10 360 10 0 40V0Z" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-neutral-800">
          
          {/* Column 1: Logo & Desc */}
          <div className="lg:col-span-4 flex flex-col gap-4 text-left">
            <div className="inline-block max-w-[140px]">
              <img
                src={appLogo}
                alt={appName}
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/Ecommercestoreslogo.png';
                }}
              />
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed font-normal max-w-sm">
              Your daily dose of fresh, organic, and healthy products delivered straight to your door. Freshness guaranteed.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-[3px] bg-red-600 rounded-sm"></span>
              <h4 className="text-sm font-bold text-white tracking-wider uppercase">Quick Links</h4>
            </div>
            <ul className="flex flex-col gap-2.5 text-sm font-medium">
              <li>
                <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-white transition-colors duration-200">About Us</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white transition-colors duration-200">Shop</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors duration-200">FAQs</Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors duration-200">Profile</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="lg:col-span-3 flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-[3px] bg-red-600 rounded-sm"></span>
              <h4 className="text-sm font-bold text-white tracking-wider uppercase">Categories</h4>
            </div>
            <ul className="flex flex-col gap-2.5 text-sm font-medium">
              <li>
                <Link to="/search?q=Fruits" className="hover:text-white transition-colors duration-200">Fruits & Vegetables</Link>
              </li>
              <li>
                <Link to="/search?q=Dairy" className="hover:text-white transition-colors duration-200">Dairy Products</Link>
              </li>
              <li>
                <Link to="/search?q=Meat" className="hover:text-white transition-colors duration-200">Meat & Fish</Link>
              </li>
              <li>
                <Link to="/search?q=Bakery" className="hover:text-white transition-colors duration-200">Bakery & Snacks</Link>
              </li>
              <li>
                <Link to="/search?q=Beverages" className="hover:text-white transition-colors duration-200">Beverages</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="lg:col-span-3 flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-[3px] bg-red-600 rounded-sm"></span>
              <h4 className="text-sm font-bold text-white tracking-wider uppercase">Contact Us</h4>
            </div>
            <div className="flex flex-col gap-3">
              
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-800/60 border border-neutral-700/50 flex items-center justify-center flex-shrink-0 text-neutral-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="text-sm text-neutral-400 leading-snug mt-1.5">{address}</span>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-800/60 border border-neutral-700/50 flex items-center justify-center flex-shrink-0 text-neutral-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <a href={`tel:${contactPhone}`} className="text-sm text-neutral-400 hover:text-white transition-colors duration-200 mt-1.5 font-semibold">
                  {contactPhone}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-800/60 border border-neutral-700/50 flex items-center justify-center flex-shrink-0 text-neutral-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <a href={`mailto:${contactEmail}`} className="text-sm text-neutral-400 hover:text-white transition-colors duration-200 mt-1.5 break-all">
                  {contactEmail}
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500 font-medium">
          <p>© {new Date().getFullYear()} {appName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/about-us" className="hover:text-neutral-300">Privacy Policy</Link>
            <Link to="/about-us" className="hover:text-neutral-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
