import logo from '../../assets/kazi_logo.svg';

const AuthLayout = ({ children, title, subtitle, showBranding = true }) => {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Branding Side - Desktop Only */}
      {showBranding && (
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-12 py-8">
          <div className="max-w-xl text-white w-full flex flex-col justify-center">
            <div className="mb-8">
              <img
                src={logo}
                alt="Kazi"
                className="h-24 w-24 rounded-2xl mb-6 shadow-2xl"
              />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">Kazi</h1>
            <p className="text-2xl text-blue-50 leading-relaxed mb-4">
              Organize your work and life, finally.
            </p>
            <p className="text-lg text-blue-100 leading-relaxed mb-8">
              Simple, powerful task management for teams and individuals.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-200 rounded-full mt-2"></div>
                <p className="text-base text-blue-50 leading-relaxed">Track tasks across multiple workspaces</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-200 rounded-full mt-2"></div>
                <p className="text-base text-blue-50 leading-relaxed">Collaborate with your team in real-time</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-200 rounded-full mt-2"></div>
                <p className="text-base text-blue-50 leading-relaxed">Stay organized with powerful filtering</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Form Side */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16 py-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo - Mobile */}
          <div className="flex justify-center lg:justify-start mb-6">
            <img
              src={logo}
              alt="Kazi"
              className="h-10 w-10 rounded-lg"
            />
          </div>

          {/* Form Container */}
          <div className="w-full">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
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
