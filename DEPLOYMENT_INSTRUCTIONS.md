# MelodyGift - Deployment Instructions

## ✅ Pre-Deployment Checklist

### 🔧 Required Configuration

#### 1. Stripe Setup (CRITICAL - Must Complete Before Going Live)

**Step 1: Create Stripe Account & Product**
1. Sign up at [stripe.com](https://stripe.com)
2. Go to Dashboard → Products → Create Product
3. Name: "Personalized Funny Birthday Song"
4. Price: €10.00 EUR (one-time payment)
5. Copy the **Price ID** (starts with `price_`)

**Step 2: Update Code**
Edit `assets/js/stripe.js` and replace:
```javascript
// REPLACE THESE VALUES:
const stripe = Stripe('pk_test_51234567890abcdef'); // Your publishable key
const PRICE_ID = 'price_1234567890abcdef'; // Your €10 price ID
```

**Step 3: Configure Webhook (Optional but Recommended)**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/webhook`
3. Select events: `checkout.session.completed`

#### 2. Email Configuration for Form Submissions

You'll receive customer details via email automatically through Netlify Forms.

### 🚀 Netlify Deployment

#### Option 1: Drag & Drop (Easiest)
1. Zip all files in this folder
2. Go to [netlify.com](https://netlify.com)
3. Drag zip file to deploy area
4. Your site will be live instantly!

#### Option 2: Git Integration (Recommended)
1. Create GitHub repository
2. Upload all files to repository
3. Connect repository to Netlify
4. Auto-deploys on every git push

### 🔧 Post-Deployment Configuration

#### 1. Netlify Forms Setup
1. Go to Netlify Dashboard → Site → Forms
2. Configure email notifications:
   - **To:** your-email@domain.com
   - **Subject:** New MelodyGift Order - {{order_id}}
3. Enable spam protection

#### 2. Custom Domain (Optional)
1. Buy domain (e.g., melodygift.com)
2. In Netlify Dashboard → Domain Settings
3. Add custom domain and follow DNS instructions

#### 3. SSL Certificate
- Automatically provided by Netlify
- Forces HTTPS for security

## 🧪 Testing Your Live Site

### Payment Flow Test
1. Visit your live site
2. Click "Create Their Song Now"
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete checkout process
5. Verify you land on success page
6. Fill out form and submit
7. Check your email for form submission

### Mobile Testing
- Test on actual mobile devices
- Check all buttons are easily tappable
- Verify form inputs work correctly
- Ensure page loads quickly

## 🔥 Going Live with Real Payments

### Switch to Live Mode
1. **Get Live Keys** from Stripe Dashboard
2. **Replace in `assets/js/stripe.js`:**
   ```javascript
   const stripe = Stripe('pk_live_YOUR_LIVE_KEY'); // Live key starts with pk_live_
   ```
3. **Create live price** for €10 in Stripe Dashboard
4. **Update PRICE_ID** with live price ID

### ⚠️ CRITICAL: Test Live Payments
- Use real card for small test payment
- Verify money appears in Stripe Dashboard
- Test refund process
- Confirm email notifications work

## 📊 Analytics Setup (Optional)

### Google Analytics
Add to `<head>` of all HTML files:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🛡️ Security & Maintenance

### Regular Tasks
- **Weekly**: Check Stripe Dashboard for payment issues
- **Monthly**: Review form submissions for improvement ideas
- **Quarterly**: Update testimonials with real customer feedback

### Security Notes
- ✅ Never commit live Stripe keys to git
- ✅ All forms have spam protection
- ✅ HTTPS enforced automatically
- ✅ Security headers configured

## 🆘 Troubleshooting

### Common Issues

**"Payment not working"**
- Check Stripe keys are correct
- Verify price ID matches your Stripe product
- Ensure you're using live keys for live site

**"Form not submitting"**
- Confirm `data-netlify="true"` is in form tag
- Check Netlify Dashboard → Forms for submissions
- Verify all required fields have `name` attributes

**"Site looks broken on mobile"**
- Clear browser cache
- Test on actual devices, not just browser dev tools
- Check CSS file is loading correctly

**"Not receiving emails"**
- Check spam folder
- Configure email notifications in Netlify Dashboard
- Verify form submissions appear in Netlify Dashboard

### Get Help
- **Stripe Issues**: Check Stripe Documentation or contact Stripe Support
- **Netlify Issues**: Check Netlify Documentation or community forums
- **General Issues**: Review browser console for JavaScript errors

## 🎉 You're All Set!

Your MelodyGift site is now ready to:
- ✅ Accept €10 payments via Stripe
- ✅ Collect customer details via forms
- ✅ Email you all order information
- ✅ Look great on all devices
- ✅ Rank well in search engines

**Next Steps:**
1. Complete Stripe configuration
2. Deploy to Netlify
3. Test everything thoroughly
4. Start promoting your hilarious song service!

---

**Need Support?** Check `CLAUDE.md` for detailed technical information or create an issue if you encounter problems.