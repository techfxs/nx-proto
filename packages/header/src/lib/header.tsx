export function AppHeader() {
  return (
    <header className="w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <a
              href="/"
              className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
            >
              NxProto
            </a>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <a
              href="/"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Home
            </a>
            <a
              href="/product"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Product
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
