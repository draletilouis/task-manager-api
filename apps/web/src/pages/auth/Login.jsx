import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContextDefinition';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Link as MuiLink,
  Stack,
  Paper,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  CheckCircleOutline,
  GroupOutlined,
  AssignmentTurnedInOutlined,
} from '@mui/icons-material';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      await login(data.email, data.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', width: '100%' }}>
      <Grid container sx={{ height: '100vh', width: '100%', margin: 0 }}>
        {/* Left Side - Green Branded Section */}
        <Grid
          item
          xs={false}
          md={6}
          sx={{
            background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            px: 6,
            position: 'relative',
            overflow: 'hidden',
            width: '50%',
            maxWidth: '50%',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '600px',
              height: '600px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-30%',
              left: '-15%',
              width: '500px',
              height: '500px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '50%',
            }
          }}
        >
          <Box sx={{ zIndex: 1, textAlign: 'center', maxWidth: '500px' }}>
            {/* Logo Placeholder */}
            <Box
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 4,
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
                TM
              </Typography>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Task Manager
            </Typography>
            <Typography variant="h6" sx={{ mb: 5, opacity: 0.9, fontWeight: 400 }}>
              Organize, Collaborate, and Achieve More
            </Typography>

            {/* Features */}
            <Stack spacing={3} sx={{ textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CheckCircleOutline sx={{ fontSize: 32, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Streamlined Workflow
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Manage tasks efficiently with our intuitive interface
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <GroupOutlined sx={{ fontSize: 32, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Team Collaboration
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Work together seamlessly across workspaces and projects
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <AssignmentTurnedInOutlined sx={{ fontSize: 32, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Track Progress
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Stay on top of deadlines and monitor project status
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Grid>

        {/* Right Side - White Login Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            px: { xs: 3, sm: 6, md: 8 },
            width: '50%',
            maxWidth: '50%',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '500px', py: 4 }}>
            {/* Mobile Logo */}
            <Box
              sx={{
                display: { xs: 'block', md: 'none' },
                textAlign: 'center',
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                  TM
                </Typography>
              </Box>
            </Box>

            {/* Form Header */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: '#1b5e20',
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                Sign in to continue to your account
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                {/* Email Field */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600, color: '#1b5e20' }}
                  >
                    Email Address
                  </Typography>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Enter a valid email address'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="Enter your email"
                        type="email"
                        fullWidth
                        size="large"
                        autoComplete="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="action" />
                            </InputAdornment>
                          ),
                          sx: { fontSize: '1.1rem' }
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Password Field */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600, color: '#1b5e20' }}
                  >
                    Password
                  </Typography>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="Enter your password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        size="large"
                        autoComplete="current-password"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                          sx: { fontSize: '1.1rem' }
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Forgot Password Link */}
                <Box sx={{ textAlign: 'right' }}>
                  <MuiLink
                    component={Link}
                    to="/forgot-password"
                    variant="body1"
                    underline="hover"
                    sx={{ fontWeight: 600, color: 'primary.main' }}
                  >
                    Forgot password?
                  </MuiLink>
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                    boxShadow: '0 4px 14px rgba(46, 125, 50, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1b5e20 0%, #0d3d10 100%)',
                      boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
                    },
                    '&:disabled': {
                      background: '#e0e0e0',
                    }
                  }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Stack>
            </form>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Don't have an account?{' '}
                <MuiLink
                  component={Link}
                  to="/register"
                  variant="body1"
                  underline="hover"
                  sx={{ fontWeight: 700, color: 'primary.main' }}
                >
                  Sign up for free
                </MuiLink>
              </Typography>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Task Manager. All rights reserved.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
