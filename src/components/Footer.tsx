export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Apex-Meridian Logo (Left - System Builder) */}
          <div className="flex items-center gap-3">
            <img 
              src="/images/apex-meridian-logo.png" 
              alt="Apex-Meridian" 
              className="h-8"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              System by Apex-Meridian®
            </span>
          </div>
          
          {/* Copyright */}
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} Apex-Meridian LLC. All rights reserved.
          </div>
          
          {/* EgyptAir Logo (Right - Client) */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Powered for
            </span>
            <img 
              src="/images/egyptair-logo.jpg" 
              alt="EgyptAir" 
              className="h-6"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

