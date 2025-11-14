# EgyptAir OCC - Fix Instructions

## Issue 1: OM-A AI Assistant Not Working

### Problem
The OM-A AI Assistant page loads but cannot process queries because the Gemini API key is not configured in Vercel environment variables.

### Root Cause
The code at `src/lib/gemini-rag.ts` line 10 tries to access:
```typescript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
```

But `GEMINI_API_KEY` is not set in Vercel's environment variables.

### Solution
You need to add the Gemini API key to Vercel:

1. **Get Your Gemini API Key:**
   - Go to https://aistudio.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key

2. **Add to Vercel Environment Variables:**
   - Go to your Vercel dashboard: https://vercel.com/apex-meridians-projects/apex-meridian-occ
   - Click on "Settings" tab
   - Click on "Environment Variables" in the left sidebar
   - Click "Add New"
   - Name: `GEMINI_API_KEY`
   - Value: (paste your API key)
   - Environment: Select "Production", "Preview", and "Development"
   - Click "Save"

3. **Redeploy:**
   - Go to "Deployments" tab
   - Click the three dots (...) on the latest deployment
   - Click "Redeploy"
   - OR just push a new commit to GitHub

### Verification
After redeployment:
1. Go to https://apex-meridian-occ.vercel.app/om-a-assistant
2. Type a question like "What are the duty time limitations for pilots?"
3. The AI should respond with relevant information from the Operations Manual

---

## Issue 2: Layout and Menu Organization

### Problems Identified
Based on user feedback, there are issues with:
- Menu interfering with content
- Elements overlapping each other
- Disorganized layout

### Potential Causes
1. **Z-index conflicts** - Sidebar, mobile menu, and content may have conflicting z-index values
2. **Fixed positioning issues** - Mobile menu button and sidebar use fixed positioning
3. **Content padding** - Main content may not have enough padding to account for sidebar
4. **Responsive breakpoints** - Layout may break at certain screen sizes

### Solutions to Implement

#### Fix 1: Ensure Proper Layout Structure
All pages should follow this structure:
```tsx
<div className="flex h-screen overflow-hidden">
  <Sidebar onLogout={handleLogout} />
  <main className="flex-1 overflow-y-auto bg-gray-50">
    {/* Page content */}
  </main>
</div>
```

#### Fix 2: Remove Stray Icon Characters
The dashboard has stray icon characters before chart headings. These need to be removed from the component.

#### Fix 3: Improve Mobile Responsiveness
- Ensure hamburger menu doesn't overlap with page titles
- Add proper padding to account for fixed mobile menu button
- Test on various screen sizes (375px, 768px, 1024px)

---

## Quick Fixes I Can Apply Now

### 1. Fix Dashboard Icon Characters
Remove the stray icons before "Hourly Operations" and "Weekly Operations" headings.

### 2. Improve Page Layout Consistency
Ensure all pages use consistent flex layout with proper overflow handling.

### 3. Add Better Mobile Spacing
Add top padding on mobile to account for the hamburger menu button.

---

## Priority Order

1. **HIGH PRIORITY:** Add GEMINI_API_KEY to Vercel (you must do this manually)
2. **MEDIUM PRIORITY:** Fix layout/menu issues (I can do this now)
3. **LOW PRIORITY:** Remove stray icon characters (I can do this now)

---

## Next Steps

**For You:**
1. Add GEMINI_API_KEY to Vercel environment variables (see instructions above)
2. Tell me which specific pages have the worst layout issues so I can prioritize fixes
3. Send me screenshots if possible showing the layout problems

**For Me:**
1. Fix the dashboard icon characters
2. Review and fix layout structure across all pages
3. Improve mobile responsiveness
4. Test and deploy fixes

---

Would you like me to proceed with fixing the layout issues now, or would you prefer to add the Gemini API key first so we can test the OM-A assistant?

