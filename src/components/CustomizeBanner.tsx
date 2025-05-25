import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilRuler, faComments } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function CustomizeBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-[#ff9800] to-[#ff5722] text-white py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want a Custom Design?
          </h2>
          <p className="text-lg md:text-xl mb-12 opacity-90">
            Let's create your perfect keychain together! Our design team is ready to bring your ideas to life.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 transform hover:scale-105 transition-transform duration-300">
              <FontAwesomeIcon icon={faPencilRuler} className="w-10 h-10 mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Custom Design Service</h3>
              <p className="opacity-90 text-lg">
                Share your vision with us, and we'll create a unique keychain design that matches your style perfectly.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 transform hover:scale-105 transition-transform duration-300">
              <FontAwesomeIcon icon={faComments} className="w-10 h-10 mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Personal Consultation</h3>
              <p className="opacity-90 text-lg">
                Get expert advice and guidance throughout the design process to ensure your satisfaction.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a 
              href="https://t.me/Samphors_Pheng"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white rounded-full text-xl font-semibold hover:bg-white hover:text-[#ff9800] transition-colors duration-300 transform hover:scale-105"
            >
              Chat on Telegram
            </a>
            <a 
              href="https://www.facebook.com/inn0wood"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#ff9800] rounded-full text-xl font-semibold hover:bg-opacity-90 transition-colors duration-300 transform hover:scale-105"
            >
              Message on Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 