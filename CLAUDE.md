# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SongJoke** - A complete landing page and payment system for personalized funny birthday songs. This is a production-ready static website with Stripe payment integration and Netlify form handling.

### Service Details
- **Product**: Personalized funny birthday songs (€10 fixed price)
- **Delivery**: Next day via email (2-3 minute songs + lyrics)
- **Target**: Funny and special birthday gifts market
- **Positioning**: Professional songwriter service (never mention AI/automation)

## Development Commands

### Local Development
```bash
# Serve locally for testing
python -m http.server 8888
# or
npx serve . -p 8888
```

### Deployment
```bash
# Deploy to Netlify
git add .
git commit -m "Deploy MelodyGift site"
git push origin main
```

## Project Structure

```
/
├── index.html              # Main landing page
├── success.html             # Post-payment form collection
├── thank-you.html          # Final confirmation page
├── assets/
│   ├── css/styles.css      # Complete responsive styling
│   ├── js/stripe.js        # Stripe payment integration
│   └── js/main.js          # Form validation & UI
├── netlify.toml           # Netlify build configuration
├── _redirects             # URL routing and redirects
└── CLAUDE.md              # This file
```

## Configuration Required

### Stripe Setup (CRITICAL)
1. **Replace Stripe Keys** in `assets/js/stripe.js`:
   ```javascript
   const stripe = Stripe('pk_live_YOUR_PUBLISHABLE_KEY'); // Replace
   const PRICE_ID = 'price_YOUR_PRICE_ID'; // Replace with €10 price ID
   ```

2. **Create Stripe Product**:
   - Product: "Personalized Funny Birthday Song"
   - Price: €10.00 EUR (recurring: false)
   - Copy the price ID to replace `PRICE_ID`

3. **Webhook Configuration**:
   - Set up webhook endpoint in Stripe Dashboard
   - Add success/cancel URLs in Stripe Dashboard

### Netlify Setup
1. **Form Handling**: Automatically configured via `data-netlify="true"`
2. **Email Notifications**: Configure in Netlify Dashboard → Forms → Settings
3. **Custom Domain**: Add custom domain in Netlify Dashboard → Domain Settings

## SEO & Content Strategy

### Primary Keywords
- funny birthday gifts
- special birthday gifts  
- unique funny birthday gift
- personalized funny gift
- hilarious birthday surprise
- custom funny song

### Content Positioning
- **Humor-focused**: Emphasize laughs and entertainment value
- **Personal touch**: Highlight customization and uniqueness
- **Affordable luxury**: €10 price point for premium experience
- **Last-minute solution**: Next-day delivery for procrastinators

## Technical Architecture

### Payment Flow
1. **Landing Page** → Stripe Checkout (€10 fixed)
2. **Stripe Success** → `success.html` with data collection form  
3. **Form Submit** → Netlify Forms → `thank-you.html`
4. **Email Notification** → Form data sent to site owner

### Form Data Collection
Required fields (exact names):
- `customer_name`, `customer_email` (customer info)
- `recipient_name`, `relationship` (recipient info)
- `favorite_things`, `personality_traits`, `special_memories` (content)
- `music_genre` (style selection)
- `order_id` (auto-generated timestamp)

### Responsive Design
- **Mobile-first** CSS Grid + Flexbox
- **Color scheme**: #FF6B6B (coral), #FFE66D (yellow), #FF8E53 (orange)
- **Typography**: Arial/web-safe fonts
- **Performance**: Optimized images, minimal dependencies

## Testing Checklist

### Before Production
- [ ] Replace Stripe test keys with live keys
- [ ] Test payment flow end-to-end
- [ ] Verify form submissions reach your email
- [ ] Test mobile responsiveness on actual devices
- [ ] Check all links and redirects work
- [ ] Validate HTML/CSS for errors
- [ ] Test page speed (should be < 3 seconds)

### SEO Verification
- [ ] Meta titles/descriptions include target keywords
- [ ] All images have alt tags
- [ ] Schema markup is valid
- [ ] Sitemap is generated
- [ ] No broken internal links

## Common Issues & Solutions

### Stripe Issues
- **"Invalid price ID"**: Update PRICE_ID in stripe.js
- **Payment not redirecting**: Check success/cancel URLs in Stripe Dashboard
- **Test mode in production**: Replace pk_test_ with pk_live_

### Form Issues
- **Form not submitting**: Ensure `data-netlify="true"` is present
- **No email notifications**: Configure in Netlify Dashboard → Forms
- **Validation errors**: Check field names match validation rules in main.js

### Performance Issues
- **Slow loading**: Optimize images, check CSS/JS file sizes
- **Mobile layout broken**: Test CSS Grid/Flexbox fallbacks
- **Poor Core Web Vitals**: Use Lighthouse to identify bottlenecks

## Maintenance

### Regular Updates
- Monitor Stripe payment success rates
- Review form submission data for improvements
- Update testimonials with real customer feedback
- A/B test headlines and CTAs for conversion optimization

### Security
- Never commit live Stripe keys to git
- Regular security headers are configured in netlify.toml
- Form spam protection is enabled via Netlify

## Analytics Integration

Add Google Analytics or similar:
```html
<!-- Add to <head> of all pages -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

Track key events:
- Page views
- Payment attempts (`begin_checkout`)
- Form submissions (`form_submit`)
- Conversion completion

This is a complete, production-ready system. Focus on configuration and testing rather than rebuilding components.