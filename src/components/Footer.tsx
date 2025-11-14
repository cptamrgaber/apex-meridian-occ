export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Apex-Meridian LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

