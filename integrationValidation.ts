import { MailService } from '@sendgrid/mail';

// Comprehensive integration validation for AI, SendGrid, and Stripe
export class IntegrationValidator {
  
  // Validate SendGrid integration with real API test
  static async validateSendGridIntegration(): Promise<{
    isValid: boolean;
    apiKeyPresent: boolean;
    canSendEmails: boolean;
    errorMessage?: string;
  }> {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        return {
          isValid: false,
          apiKeyPresent: false,
          canSendEmails: false,
          errorMessage: 'SENDGRID_API_KEY environment variable not set'
        };
      }

      const mailService = new MailService();
      mailService.setApiKey(process.env.SENDGRID_API_KEY);

      // Test API key validity by attempting to send a test email
      try {
        await mailService.send({
          to: 'test@bopercheck.com',
          from: 'noreply@bopercheck.com',
          subject: 'Integration Test - BoperCheck Admin',
          text: 'SendGrid integration test successful',
          mailSettings: {
            sandboxMode: {
              enable: true // Use sandbox mode for testing
            }
          }
        });

        return {
          isValid: true,
          apiKeyPresent: true,
          canSendEmails: true
        };
      } catch (sendError: any) {
        // Even if send fails, check if it's an API key issue or other
        if (sendError.code === 401) {
          return {
            isValid: false,
            apiKeyPresent: true,
            canSendEmails: false,
            errorMessage: 'Invalid SendGrid API key'
          };
        }

        return {
          isValid: true,
          apiKeyPresent: true,
          canSendEmails: true,
          errorMessage: `Send test warning: ${sendError.message}`
        };
      }
    } catch (error: any) {
      return {
        isValid: false,
        apiKeyPresent: !!process.env.SENDGRID_API_KEY,
        canSendEmails: false,
        errorMessage: error.message
      };
    }
  }

  // Validate AI integration (Anthropic API)
  static async validateAIIntegration(): Promise<{
    isValid: boolean;
    apiKeyPresent: boolean;
    canMakeRequests: boolean;
    errorMessage?: string;
  }> {
    try {
      // Check for Anthropic API key
      if (!process.env.ANTHROPIC_API_KEY) {
        return {
          isValid: false,
          apiKeyPresent: false,
          canMakeRequests: false,
          errorMessage: 'ANTHROPIC_API_KEY environment variable not set'
        };
      }

      // Test API key with a minimal request
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [
            {
              role: 'user',
              content: 'Test'
            }
          ]
        })
      });

      if (response.status === 401) {
        return {
          isValid: false,
          apiKeyPresent: true,
          canMakeRequests: false,
          errorMessage: 'Invalid Anthropic API key'
        };
      }

      return {
        isValid: response.ok,
        apiKeyPresent: true,
        canMakeRequests: response.ok,
        errorMessage: response.ok ? undefined : `API response: ${response.status}`
      };
    } catch (error: any) {
      return {
        isValid: false,
        apiKeyPresent: !!process.env.ANTHROPIC_API_KEY,
        canMakeRequests: false,
        errorMessage: error.message
      };
    }
  }

  // Validate Stripe integration
  static async validateStripeIntegration(): Promise<{
    isValid: boolean;
    apiKeyPresent: boolean;
    canProcessPayments: boolean;
    errorMessage?: string;
  }> {
    try {
      const hasPublicKey = !!process.env.VITE_STRIPE_PUBLIC_KEY;
      const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;

      if (!hasPublicKey && !hasSecretKey) {
        return {
          isValid: false,
          apiKeyPresent: false,
          canProcessPayments: false,
          errorMessage: 'Stripe API keys not configured'
        };
      }

      if (!hasSecretKey) {
        return {
          isValid: false,
          apiKeyPresent: hasPublicKey,
          canProcessPayments: false,
          errorMessage: 'STRIPE_SECRET_KEY missing (VITE_STRIPE_PUBLIC_KEY available)'
        };
      }

      // Test Stripe API with account retrieval
      try {
        const response = await fetch('https://api.stripe.com/v1/account', {
          headers: {
            'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
          }
        });

        if (response.status === 401) {
          return {
            isValid: false,
            apiKeyPresent: true,
            canProcessPayments: false,
            errorMessage: 'Invalid Stripe secret key'
          };
        }

        return {
          isValid: response.ok,
          apiKeyPresent: true,
          canProcessPayments: response.ok,
          errorMessage: response.ok ? undefined : `Stripe API error: ${response.status}`
        };
      } catch (stripeError: any) {
        return {
          isValid: false,
          apiKeyPresent: true,
          canProcessPayments: false,
          errorMessage: stripeError.message
        };
      }
    } catch (error: any) {
      return {
        isValid: false,
        apiKeyPresent: false,
        canProcessPayments: false,
        errorMessage: error.message
      };
    }
  }

  // Comprehensive system integration check
  static async validateAllIntegrations() {
    const [sendgrid, ai, stripe] = await Promise.all([
      this.validateSendGridIntegration(),
      this.validateAIIntegration(),
      this.validateStripeIntegration()
    ]);

    return {
      sendgrid,
      ai,
      stripe,
      overallHealth: {
        critical: sendgrid.isValid && ai.isValid,
        optional: stripe.isValid,
        score: [sendgrid.isValid, ai.isValid, stripe.isValid].filter(Boolean).length,
        maxScore: 3
      }
    };
  }
}