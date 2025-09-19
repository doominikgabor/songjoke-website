# Monitoring & Analytics Setup Guide for MelodyGift

## 🎯 Overview

This comprehensive guide covers setting up monitoring, analytics, and performance tracking for the MelodyGift website to ensure optimal performance and business insights.

## 📊 Analytics Implementation

### Google Analytics 4 Setup

#### 1. Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com)
2. Create new property: "MelodyGift"
3. Configure data stream for website
4. Copy Measurement ID (format: G-XXXXXXXXXX)

#### 2. Implementation Code
Add to `<head>` section of all pages:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  gtag('config', 'G-XXXXXXXXXX', {
    // Enhanced measurements
    page_title: true,
    page_location: true,
    scroll_events: true,
    outbound_clicks: true,
    site_search: false,
    video_engagement: false,
    file_downloads: true
  });
</script>
```

#### 3. Enhanced E-commerce Tracking
Already implemented in `assets/js/stripe.js`:

```javascript
// Purchase tracking (when payment succeeds)
gtag('event', 'purchase', {
  'transaction_id': orderIdField.value,
  'value': 10.00,
  'currency': 'EUR',
  'items': [{
    'item_id': 'funny_birthday_song',
    'item_name': 'Personalized Funny Birthday Song',
    'category': 'Digital Product',
    'quantity': 1,
    'price': 10.00
  }]
});

// Checkout process tracking
gtag('event', 'begin_checkout', {
  'currency': 'EUR',
  'value': 10.00,
  'items': [{
    'item_id': 'funny_birthday_song',
    'item_name': 'Personalized Funny Birthday Song',
    'category': 'Digital Product',
    'quantity': 1,
    'price': 10.00
  }]
});
```

#### 4. Custom Events Tracking
Add to `assets/js/main.js`:

```javascript
// Track form interactions
document.getElementById('songOrderForm').addEventListener('submit', function(e) {
  gtag('event', 'form_submit', {
    'form_name': 'song_order',
    'engagement_time_msec': Date.now() - pageLoadTime
  });
});

// Track section views
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      gtag('event', 'scroll', {
        'section_name': entry.target.id,
        'percent_scrolled': Math.round(entry.intersectionRatio * 100)
      });
    }
  });
});

// Track CTA button clicks
document.querySelectorAll('.cta-button').forEach(button => {
  button.addEventListener('click', function() {
    gtag('event', 'cta_click', {
      'button_text': this.textContent.trim(),
      'button_location': this.closest('section').id || 'unknown'
    });
  });
});
```

### Facebook Pixel Setup

#### 1. Create Facebook Pixel
1. Go to Facebook Business Manager
2. Navigate to Events Manager
3. Create new pixel for "MelodyGift"
4. Copy Pixel ID

#### 2. Implementation Code
Add to `<head>` section:

```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', 'XXXXXXXXXX');
fbq('track', 'PageView');

// Custom events
fbq('track', 'ViewContent', {
  content_name: 'Funny Birthday Song Landing Page',
  content_category: 'Product Page'
});
</script>

<noscript>
  <img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=XXXXXXXXXX&ev=PageView&noscript=1" />
</noscript>
```

#### 3. Conversion Tracking
Add to success and thank-you pages:

```javascript
// Purchase conversion
fbq('track', 'Purchase', {
  value: 10.00,
  currency: 'EUR',
  content_name: 'Personalized Funny Birthday Song',
  content_category: 'Digital Product',
  content_ids: ['funny_birthday_song'],
  content_type: 'product'
});

// Lead generation (form completion)
fbq('track', 'Lead', {
  content_name: 'Song Order Form',
  value: 10.00,
  currency: 'EUR'
});
```

## 🔍 Performance Monitoring

### Core Web Vitals Tracking

#### 1. Web Vitals Library
Add to your site:

```html
<script type="module">
import {onCLS, onFID, onFCP, onLCP, onTTFB} from 'https://unpkg.com/web-vitals@3?module';

function sendToAnalytics(metric) {
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true,
  });
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
</script>
```

#### 2. Performance Targets
- **LCP (Largest Contentful Paint)**: <2.5s
- **FID (First Input Delay)**: <100ms  
- **CLS (Cumulative Layout Shift)**: <0.1
- **FCP (First Contentful Paint)**: <1.8s
- **TTFB (Time to First Byte)**: <600ms

### Real User Monitoring (RUM)

#### 1. Netlify Analytics
Enable in Netlify Dashboard:
- Site Settings → Analytics
- Enable server-side analytics
- Track unique visitors, page views, bandwidth

#### 2. Google PageSpeed Insights API
Automated monitoring script:

```javascript
// Monitor performance weekly
const PSI_API_KEY = 'your_api_key';
const url = 'https://melodygift.netlify.app';

async function checkPageSpeed() {
  const response = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${PSI_API_KEY}&strategy=mobile`
  );
  const data = await response.json();
  
  // Send to analytics
  gtag('event', 'performance_audit', {
    'performance_score': data.lighthouseResult.categories.performance.score * 100,
    'lcp_score': data.lighthouseResult.audits['largest-contentful-paint'].score * 100,
    'fid_score': data.lighthouseResult.audits['max-potential-fid'].score * 100
  });
}
```

## 🚨 Error Tracking & Monitoring

### Sentry Error Tracking

#### 1. Setup Sentry
```html
<script src="https://browser.sentry-cdn.com/7.74.1/bundle.min.js"></script>
<script>
Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});
</script>
```

#### 2. Custom Error Tracking
```javascript
// Track Stripe errors
window.addEventListener('error', function(event) {
  if (event.error && event.error.message && event.error.message.includes('Stripe')) {
    Sentry.captureException(event.error, {
      tags: {
        component: 'stripe_integration',
        page: window.location.pathname
      }
    });
  }
});

// Track form errors
document.getElementById('songOrderForm').addEventListener('submit', function(e) {
  try {
    // Form submission logic
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        component: 'form_submission',
        form_name: 'song_order'
      }
    });
  }
});
```

### JavaScript Error Monitoring
```javascript
window.addEventListener('error', function(e) {
  gtag('event', 'exception', {
    'description': e.error.message,
    'fatal': false,
    'filename': e.filename,
    'lineno': e.lineno
  });
});

window.addEventListener('unhandledrejection', function(e) {
  gtag('event', 'exception', {
    'description': 'Unhandled Promise Rejection: ' + e.reason,
    'fatal': false
  });
});
```

## 📈 Business Intelligence

### Key Performance Indicators (KPIs)

#### 1. Traffic Metrics
- **Unique Visitors**: Daily/Weekly/Monthly
- **Page Views**: Total and per page
- **Bounce Rate**: Target <40%
- **Session Duration**: Target >2 minutes
- **Traffic Sources**: Organic, Direct, Referral, Social

#### 2. Conversion Metrics
- **Conversion Rate**: Payment completions / Visitors
- **Form Completion Rate**: Forms submitted / Success page views
- **Average Order Value**: €10 (fixed price)
- **Customer Acquisition Cost**: Ad spend / Conversions

#### 3. Performance Metrics
- **Page Load Speed**: Target <3 seconds
- **Core Web Vitals**: All metrics in "Good" range
- **Uptime**: Target >99.9%
- **Error Rate**: Target <0.1%

### Google Analytics 4 Dashboard Setup

#### 1. Custom Reports
Create reports for:

**Conversion Funnel**
```
Landing Page Views
↓
CTA Button Clicks
↓
Stripe Checkout Initiated
↓
Payment Success
↓
Form Completion
```

**Traffic Analysis**
- Traffic sources breakdown
- Geographic distribution
- Device/browser analysis
- Time-based patterns

#### 2. Goal Configuration
Set up conversions:

1. **Purchase Completion**
   - Event: purchase
   - Value: €10

2. **Form Submission**
   - Event: form_submit
   - Conversion value: €10

3. **Engagement Goals**
   - Time on page >2 minutes
   - Scroll depth >75%
   - Multiple page visits

### Data Studio Dashboard

#### 1. Create Comprehensive Dashboard
Connect GA4, Facebook Ads, and other data sources:

**Page 1: Traffic Overview**
- Total visitors
- Traffic sources
- Geographic distribution
- Device breakdown

**Page 2: Conversion Analysis**
- Conversion rates
- Revenue tracking
- Funnel analysis
- Customer journey

**Page 3: Performance Monitoring**
- Page speed metrics
- Core Web Vitals
- Error rates
- Uptime status

## 🔔 Alerting & Notifications

### Uptime Monitoring

#### 1. UptimeRobot Setup (Free)
```
Monitor Type: HTTP(s)
URL: https://melodygift.netlify.app
Monitoring Interval: 5 minutes
Alert Contacts: hello@melodygift.com
```

#### 2. Netlify Deploy Notifications
Configure in Netlify:
- Deploy success/failure notifications
- Form submission alerts
- Build error notifications

### Performance Alerts

#### 1. Google Analytics Intelligence
Set up automatic insights:
- Traffic anomalies
- Conversion drops
- Performance issues

#### 2. Custom Alerts
```javascript
// Performance degradation alert
if (performanceScore < 80) {
  fetch('/webhook/performance-alert', {
    method: 'POST',
    body: JSON.stringify({
      score: performanceScore,
      timestamp: Date.now(),
      url: window.location.href
    })
  });
}
```

## 🔧 Implementation Steps

### Phase 1: Basic Analytics (Day 1)
1. [ ] Set up Google Analytics 4
2. [ ] Implement basic tracking code
3. [ ] Configure e-commerce tracking
4. [ ] Test event tracking

### Phase 2: Advanced Tracking (Week 1)
1. [ ] Set up Facebook Pixel
2. [ ] Implement custom events
3. [ ] Configure conversion tracking
4. [ ] Set up error monitoring

### Phase 3: Performance Monitoring (Week 2)
1. [ ] Implement Core Web Vitals tracking
2. [ ] Set up uptime monitoring
3. [ ] Configure performance alerts
4. [ ] Create monitoring dashboard

### Phase 4: Business Intelligence (Week 3)
1. [ ] Create custom GA4 reports
2. [ ] Set up Data Studio dashboard
3. [ ] Configure automated insights
4. [ ] Establish KPI monitoring

## 📊 Analytics Configuration Files

### Environment Variables
```bash
# Analytics IDs
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
FACEBOOK_PIXEL_ID=XXXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn
HOTJAR_ID=XXXXXXX

# Feature flags
ENABLE_ANALYTICS=true
ENABLE_ERROR_TRACKING=true
ENABLE_PERFORMANCE_MONITORING=true
```

### Google Tag Manager (Alternative Setup)
If using GTM instead of direct GA4:

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

## 🧪 Testing & Validation

### Analytics Testing
1. **Google Analytics Debugger**
   - Install Chrome extension
   - Verify events firing correctly
   - Check real-time reports

2. **Facebook Pixel Helper**
   - Install Chrome extension
   - Verify pixel implementation
   - Test custom events

3. **Tag Assistant Legacy**
   - Validate Google Tags
   - Check for implementation errors
   - Verify data layer events

### Performance Testing Tools
- **PageSpeed Insights**: pagespeed.web.dev
- **GTmetrix**: gtmetrix.com
- **WebPageTest**: webpagetest.org
- **Lighthouse**: Built into Chrome DevTools

## 📋 Monitoring Checklist

### Daily
- [ ] Check uptime status
- [ ] Review error logs
- [ ] Monitor conversion rates
- [ ] Check form submissions

### Weekly
- [ ] Analyze traffic trends
- [ ] Review performance metrics
- [ ] Check conversion funnel
- [ ] Update KPI dashboard

### Monthly
- [ ] Full analytics review
- [ ] Performance audit
- [ ] Competitor analysis
- [ ] ROI calculation
- [ ] Strategy optimization

## 🎯 Success Metrics

### Week 1 Targets
- Analytics setup complete: 100%
- Error rate: <0.1%
- Performance score: >90
- Uptime: >99%

### Month 1 Targets
- Conversion rate: >2%
- Average session duration: >2 minutes
- Bounce rate: <50%
- Core Web Vitals: All "Good"

### Quarter 1 Targets
- Monthly unique visitors: 1,000+
- Monthly conversions: 20+
- Customer acquisition cost: <€20
- Return visitor rate: >15%

---

## ✅ Ready for Launch!

Your monitoring and analytics setup provides:
- 📊 Comprehensive traffic analysis
- 💰 Complete conversion tracking
- ⚡ Real-time performance monitoring
- 🚨 Proactive error alerting
- 📈 Actionable business insights

**Launch with confidence knowing every metric is tracked!** 🚀

---

*Remember to update tracking IDs and DSNs with your actual values before going live.*