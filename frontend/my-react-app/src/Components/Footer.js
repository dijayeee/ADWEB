import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">WearHaus</h3>
            <p className="text-sm mb-4">Your one-stop destination for quality products at amazing prices. Shop with confidence and enjoy fast delivery.</p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/Renren248" className="hover:text-blue-400 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-pink-400 transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-red-400 transition">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition text-sm">About Us</a></li>
              <li><a href="#" className="hover:text-white transition text-sm">Shop</a></li>
              <li><a href="#" className="hover:text-white transition text-sm">Categories</a></li>
              <li><a href="#" className="hover:text-white transition text-sm">Deals</a></li>
              <li><a href="#" className="hover:text-white transition text-sm">Blog</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition text-sm">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition text-sm">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition text-sm">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-white transition text-sm">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition text-sm">Track Order</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">123 Commerce St, Shopping District, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">support@wearhaus.com</span>
              </li>
            </ul>
          </div>
        </div>

      
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2025 WearHaus. All rights reserved.</p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;