import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContextDefinition';
import { User, LogOut, Settings, ChevronDown, LayoutGrid, Search, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Don't show navbar on login/register pages
  if (!isAuthenticated) {
    return null;
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const isActive = (path) => location.pathname === path;

  // Generate breadcrumb based on current route
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [];

    // Always show home
    breadcrumbs.push({ label: 'Workspaces', path: '/workspaces', active: path === '/workspaces' });

    // Add workspace if present
    if (params.workspaceId && path.includes('/workspaces/')) {
      breadcrumbs.push({
        label: 'Workspace',
        path: `/workspaces/${params.workspaceId}`,
        active: path === `/workspaces/${params.workspaceId}`
      });
    }

    // Add project if present
    if (params.projectId && path.includes('/projects/')) {
      breadcrumbs.push({
        label: 'Project',
        path: `/workspaces/${params.workspaceId}/projects/${params.projectId}`,
        active: path === `/workspaces/${params.workspaceId}/projects/${params.projectId}`
      });
    }

    // Add task if present
    if (params.taskId && path.includes('/tasks/')) {
      breadcrumbs.push({
        label: 'Task',
        path: location.pathname,
        active: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/workspaces" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Kazi</span>
            </Link>
          </div>

          {/* Center: Breadcrumb Navigation */}
          <div className="flex-1 flex justify-center px-8">
            {breadcrumbs.length > 0 && (
              <div className="hidden md:flex items-center space-x-2">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center space-x-2">
                    {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                    <Link
                      to={crumb.path}
                      className={`text-base font-semibold transition-colors ${
                        crumb.active
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      {crumb.label}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Search and User Menu */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <button
              className="flex items-center space-x-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                // Placeholder for search functionality
                console.log('Search clicked');
              }}
            >
              <Search className="w-5 h-5 text-gray-500" />
              <span className="hidden lg:inline text-sm text-gray-600">Search</span>
              <kbd className="hidden xl:inline px-2 py-1 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">
                ⌘K
              </kbd>
            </button>

            {/* User Menu Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {/* Avatar */}
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  {getUserInitials()}
                </div>

                {/* User Info - Hidden on smaller screens */}
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[120px]">
                    {user?.email}
                  </div>
                </div>

                <ChevronDown className={`hidden lg:block w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info in Dropdown (Mobile) */}
                  <div className="md:hidden px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.name || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4 mr-3 text-gray-500" />
                    Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-3 text-gray-500" />
                    Settings
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
