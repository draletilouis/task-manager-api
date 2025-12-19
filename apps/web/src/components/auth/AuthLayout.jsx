import logo from '../../assets/kazi_logo.svg';

const AuthLayout = ({ children, title, subtitle, showBranding = true }) => {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Branding Side - Desktop Only */}
      {showBranding && (
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-12 py-8">
          <div className="max-w-xl text-white w-full flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">Kazi</h1>
            <p className="text-3xl text-blue-50 leading-relaxed mb-6">
              Organize your work and life, finally.
            </p>
            <p className="text-xl text-blue-100 leading-relaxed mb-10">
              Simple, powerful task management for teams and individuals.
            </p>
            <div className="space-y-5 max-w-md">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-200 rounded-full"></div>
                <p className="text-lg text-blue-50 leading-relaxed">Track tasks across multiple workspaces</p>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-200 rounded-full"></div>
                <p className="text-lg text-blue-50 leading-relaxed">Collaborate with your team in real-time</p>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-200 rounded-full"></div>
                <p className="text-lg text-blue-50 leading-relaxed">Stay organized with powerful filtering</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Form Side */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16 py-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Form Container */}
          <div className="w-full">
            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {title}
              </h2>
              {subtitle && (
                <p className="text-base text-gray-600">{subtitle}</p>
              )}
            </div>

            {/* Form Content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
