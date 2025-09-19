# Environment Configuration Guide for MelodyGift

This guide covers environment-specific configurations for development, staging, and production deployments.

## 🏗️ Environment Overview

### Development Environment
- **Purpose**: Local development and testing
- **Stripe**: Test mode keys
- **Analytics**: Disabled or test accounts
- **Caching**: Minimal for faster iteration
- **Security**: Relaxed for debugging

### Staging Environment (Netlify Deploy Previews)
- **Purpose**: Testing before production deployment
- **Stripe**: Test mode keys
- **Analytics**: Staging/test accounts
- **Caching**: Production-like
- **Security**: Production-level

### Production Environment
- **Purpose**: Live customer-facing site
- **Stripe**: Live keys (when ready)
- **Analytics**: Live tracking
- **Caching**: Optimized for performance
- **Security**: Maximum protection

## 🔧 Netlify Environment Variables

### Development/Test Environment Variables
```bash
# Node environment
NODE_ENV=development

# Stripe configuration (Test Mode)
STRIPE_PUBLISHABLE_KEY=pk_test_51S97daPRedbE2ey9ARFypY73B70OsC5Bbc2d9QXFhQjfKLaZeHad8UzkL7ugdEzvi6RIh5VgbvUEFX7yUw5NRt5l00Xv31OLsO
STRIPE_PRICE_ID=price_1S97pPPRedbE2ey9CvR9FZ4L
STRIPE_WEBHOOK_SECRET=whsec_test_... # If using webhooks

# Analytics (Test accounts)
GOOGLE_ANALYTICS_ID=G-TEST123456
FACEBOOK_PIXEL_ID=123456789
HOTJAR_ID=test_id

# Site configuration
SITE_URL=https://deploy-preview-123--melodygift.netlify.app
CONTACT_EMAIL=test@melodygift.com

# Feature flags
ENABLE_ANALYTICS=false
ENABLE_CHAT_WIDGET=false
MAINTENANCE_MODE=false
```

### Production Environment Variables
```bash
# Node environment
NODE_ENV=production

# Stripe configuration (Live Mode - Set when ready to go live)
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY_HERE
STRIPE_PRICE_ID=price_YOUR_LIVE_PRICE_ID
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET

# Analytics (Live accounts)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
FACEBOOK_PIXEL_ID=XXXXXXXXXX
HOTJAR_ID=XXXXXXX

# Site configuration
SITE_URL=https://melodygift.com
CONTACT_EMAIL=hello@melodygift.com

# Feature flags
ENABLE_ANALYTICS=true
ENABLE_CHAT_WIDGET=true
MAINTENANCE_MODE=false

# Performance monitoring
NEW_RELIC_LICENSE_KEY=your_key_here
SENTRY_DSN=https://your_sentry_dsn
```

## 📝 Setting Environment Variables in Netlify

### Via Netlify Dashboard
1. Go to your site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add variable**
4. Enter variable name and value
5. Choose scope: **All scopes** (recommended) or specific branches

### Via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Set environment variables
netlify env:set STRIPE_PUBLISHABLE_KEY "pk_test_..."
netlify env:set NODE_ENV "production"
netlify env:set GOOGLE_ANALYTICS_ID "G-XXXXXXXXXX"

# List all environment variables
netlify env:list

# Deploy with specific environment
netlify deploy --prod
```

### Via netlify.toml (Public variables only)
```toml
[context.production.environment]
  NODE_ENV = "production"
  SITE_URL = "https://melodygift.com"

[context.deploy-preview.environment]
  NODE_ENV = "staging"
  SITE_URL = "https://deploy-preview-DEPLOY_ID--melodygift.netlify.app"

[context.branch-deploy.environment]
  NODE_ENV = "development"
```

## 🚀 Environment-Specific Configurations

### Development Configuration

**Local Development Server**
```bash
# Using Python
python -m http.server 8000

# Using Node.js (if package.json exists)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

**Development Features**
- Console logging enabled
- Stripe test mode warnings
- No analytics tracking
- Fast reload/refresh
- Detailed error messages

### Staging Configuration

**Deploy Preview Settings**
- Automatic previews for pull requests
- Test environment variables
- Production-like caching
- Analytics with staging accounts
- Full security headers

**Netlify Deploy Preview URL Format**
```
https://deploy-preview-[PR_NUMBER]--melodygift.netlify.app
```

### Production Configuration

**Live Site Features**
- Stripe live keys (when ready)
- Full analytics tracking
- Maximum caching
- All security headers
- Error tracking and monitoring

## 🔄 Environment Switching Workflow

### Test to Live Stripe Migration

**Current Status**: ✅ Ready for immediate deployment with test keys

**When Ready for Live Payments**:

1. **Create Live Stripe Products**
   ```bash
   # In Stripe Dashboard:
   # 1. Switch to Live mode
   # 2. Create new product: "Personalized Funny Birthday Song"
   # 3. Set price: €10.00
   # 4. Copy the new price ID
   ```

2. **Update Environment Variables**
   ```bash
   # In Netlify Dashboard:
   STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
   STRIPE_PRICE_ID=price_YOUR_LIVE_PRICE_ID
   ```

3. **Update Code (if using hard-coded values)**
   ```javascript
   // In assets/js/stripe.js, replace:
   const stripe = Stripe('pk_test_...');
   const PRICE_ID = 'price_1S97pP...';
   
   // With:
   const stripe = Stripe(process.env.STRIPE_PUBLISHABLE_KEY || 'pk_live_...');
   const PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_live_...';
   ```

4. **Test Live Payments**
   - Start with small test purchases
   - Verify webhook delivery (if implemented)
   - Check Stripe dashboard for successful charges

### Analytics Environment Switch

**Google Analytics**
```javascript
// Environment-aware GA implementation
const GA_ID = process.env.NODE_ENV === 'production' 
  ? 'G-LIVE-ID' 
  : 'G-TEST-ID';

gtag('config', GA_ID);
```

**Facebook Pixel**
```javascript
// Environment-aware Pixel implementation
if (process.env.NODE_ENV === 'production') {
  fbq('init', 'LIVE_PIXEL_ID');
} else {
  fbq('init', 'TEST_PIXEL_ID');
}
```

## 🧪 Testing Environments

### Local Testing Checklist
- [ ] All forms submit correctly
- [ ] Stripe test payments work
- [ ] Navigation functions properly
- [ ] Mobile responsiveness
- [ ] Page load performance
- [ ] Console error-free

### Staging Testing Checklist
- [ ] Deploy preview URL accessible
- [ ] Environment variables loaded correctly
- [ ] SSL certificate working
- [ ] Form submissions to Netlify
- [ ] Analytics tracking (staging accounts)
- [ ] All redirects functioning

### Production Testing Checklist
- [ ] Live domain accessible
- [ ] Custom domain SSL working
- [ ] Contact forms delivering emails
- [ ] Analytics tracking live accounts
- [ ] Page speed optimized
- [ ] SEO meta tags correct
- [ ] Search console verification

## 🔧 Troubleshooting Environment Issues

### Common Problems

**Environment Variables Not Loading**
```bash
# Check current environment
netlify env:list

# Verify in build logs
# Look for "Environment variables" section

# Test locally with netlify dev
netlify dev
```

**Stripe Keys Not Working**
- Verify key format: `pk_test_` or `pk_live_`
- Check key permissions in Stripe dashboard
- Ensure price ID matches environment
- Verify webhook endpoints (if used)

**Analytics Not Tracking**
- Check GA tracking ID format
- Verify pixel ID is correct
- Test with browser dev tools
- Check consent/privacy settings

### Debug Commands

**Check Environment**
```bash
# List all environment variables
netlify env:list

# Check build logs
netlify logs

# Test local environment
netlify dev --live

# Check site status
netlify status
```

**Verify Configuration**
```bash
# Test site locally
netlify dev

# Check build output
netlify build

# Validate redirects
netlify deploy --dry-run
```

## 📊 Environment Monitoring

### Key Metrics by Environment

**Development**
- Build time
- Local server response time
- Error frequency

**Staging**
- Deploy preview success rate
- Performance scores
- Cross-browser compatibility

**Production**
- Uptime percentage
- Page load speed
- Conversion rates
- Error rates

### Monitoring Tools Setup

**Netlify Analytics**
```toml
# In netlify.toml
[build.environment]
  NETLIFY_ANALYTICS = "true"
```

**Third-party Monitoring**
- Uptime Robot (free tier)
- Pingdom (performance monitoring)
- Sentry (error tracking)
- New Relic (APM)

## 🛡️ Security by Environment

### Development Security
- HTTP allowed (localhost only)
- Relaxed CSP for debugging
- Console logging enabled
- Source maps included

### Staging Security
- HTTPS enforced
- Production-level headers
- No console logging
- Limited access (preview links only)

### Production Security
- HTTPS only with HSTS
- Strict CSP headers
- No debug information
- Rate limiting (if implemented)
- Security monitoring

---

## 🎯 Quick Setup Commands

### Initial Setup
```bash
# Deploy to Netlify
netlify deploy --prod

# Set essential environment variables
netlify env:set NODE_ENV "production"
netlify env:set STRIPE_PUBLISHABLE_KEY "pk_test_YOUR_KEY"
netlify env:set SITE_URL "https://your-site.netlify.app"

# Enable forms
netlify forms:enable
```

### Going Live Checklist
```bash
# 1. Update Stripe to live keys
netlify env:set STRIPE_PUBLISHABLE_KEY "pk_live_YOUR_LIVE_KEY"
netlify env:set STRIPE_PRICE_ID "price_YOUR_LIVE_PRICE"

# 2. Enable analytics
netlify env:set GOOGLE_ANALYTICS_ID "G-YOUR_LIVE_ID"
netlify env:set ENABLE_ANALYTICS "true"

# 3. Set production URL
netlify env:set SITE_URL "https://melodygift.com"

# 4. Deploy
netlify deploy --prod
```

Your environment is now configured for scalable, secure deployment across all stages! 🚀