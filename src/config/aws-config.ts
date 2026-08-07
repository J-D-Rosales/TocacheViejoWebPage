/**
 * AWS Amplify Authentication Configuration
 * Replace the placeholder values with your real AWS Cognito credentials.
 * You can use environment variables by setting them in your .env file:
 *   VITE_AWS_REGION=us-east-1
 *   VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
 *   VITE_COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
 */
import { Amplify } from 'aws-amplify'

export const awsConfig = {
  region: import.meta.env.VITE_AWS_REGION ?? 'us-east-1',
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID ?? 'us-east-1_MockPoolId',
  userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID ?? 'mockAppClientId123456789',
  /** Base URL for your API Gateway (no trailing slash) */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://YOUR_API_GATEWAY_ID.execute-api.us-east-1.amazonaws.com/prod',
}

/**
 * Configure Amplify Auth once at app bootstrap.
 * Call this function in main.tsx before <App /> is rendered.
 */
export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: awsConfig.userPoolId,
        userPoolClientId: awsConfig.userPoolClientId,
        loginWith: {
          email: true,
        },
      },
    },
  })
}
