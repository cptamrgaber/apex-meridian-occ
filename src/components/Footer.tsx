export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Apex-Meridian Logo (Left - System Builder) */}
          <div className="flex items-center gap-3">
            <img 
              src="/images/apex-meridian-logo.png" 
              alt="Apex-Meridian" 
              className="h-8"
            />
            <span className="text-sm text-gray-600 font-medium">
              System by Apex-Meridian®
            </span>
          </div>
          
          {/* Copyright */}
          <div className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Apex-Meridian LLC. All rights reserved.
          </div>
          
          {/* EgyptAir Logo (Right - Client) */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">
              Powered for
            </span>
            <img 
              src="/images/egyptair-logo.jpg" 
              alt="EgyptAir" 
              className="h-7"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

