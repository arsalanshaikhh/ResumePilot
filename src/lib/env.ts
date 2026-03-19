/**
 * Environment validation utilities
 * Ensures required environment variables are set
 */

interface EnvConfig {
  clerkPublishableKey: string
  openRouterApiKey?: string
  openRouterBaseUrl: string
  appName: string
  appVersion: string
  apiTimeout: number
  debugMode: boolean
}

/**
 * Validate required environment variables
 * @throws Error if required variables are missing
 */
function validateEnv(): EnvConfig {
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  
  if (!clerkKey) {
    throw new Error(
      'Missing required environment variable: VITE_CLERK_PUBLISHABLE_KEY\n' +
      'Please add it to your .env file.'
    )
  }

  // Warn if it looks like a placeholder
  if (clerkKey.includes('your_') || clerkKey.includes('test_')) {
    console.warn(
      'Warning: VITE_CLERK_PUBLISHABLE_KEY appears to be a placeholder. ' +
      'Please set a valid Clerk publishable key.'
    )
  }

  return {
    clerkPublishableKey: clerkKey,
    openRouterApiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    openRouterBaseUrl: import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    appName: import.meta.env.VITE_APP_NAME || 'ResumePilot',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
    apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  }
}

// Export validated environment config
const envConfig = validateEnv()

export { envConfig, validateEnv }
export type { EnvConfig }
