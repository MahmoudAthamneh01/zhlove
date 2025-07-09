# 🔍 Environment Variables Audit Report - ZH-Love Project

## 📋 Executive Summary

**Audit Date**: $(date)  
**Project**: ZH-Love Next.js Application  
**Environment Variables Audited**: `NEXTAUTH_SECRET`, `NEXT_PUBLIC_API_URL`  
**Overall Status**: ⚠️ **REQUIRES ATTENTION** - Several critical issues found

---

## 🔐 1. NEXTAUTH_SECRET Analysis

### ✅ **Correct Usage Found**
- **Location**: `src/lib/auth.ts:5`
- **Implementation**: 
  ```typescript
  secret: process.env.NEXTAUTH_SECRET || 'zh-love-super-secret-key-2024-change-in-production'
  ```
- **NextAuth Route**: Correctly configured in `src/app/_api/auth/[...nextauth]/route.ts`

### ⚠️ **Critical Security Issues**

#### 1. **Insecure Fallback Value in Production**
```typescript
// SECURITY RISK: Hard-coded fallback
secret: process.env.NEXTAUTH_SECRET || 'zh-love-super-secret-key-2024-change-in-production'
```

**Risk Level**: 🔴 **HIGH**  
**Issue**: The fallback value is predictable and visible in source code  
**Recommendation**: Remove fallback or make it development-only

#### 2. **Vercel Configuration**
- **Found in**: `vercel.json:6`
- **Configuration**: `"NEXTAUTH_SECRET": "@nextauth_secret"`
- **Status**: ✅ Correctly references Vercel secret variable

### 🛠️ **Recommended Fixes**

```typescript
// BEFORE (Current - Insecure)
secret: process.env.NEXTAUTH_SECRET || 'zh-love-super-secret-key-2024-change-in-production'

// AFTER (Secure)
secret: process.env.NEXTAUTH_SECRET || (() => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXTAUTH_SECRET environment variable is required in production')
  }
  return 'dev-secret-key-only-for-development'
})()
```

---

## 🌐 2. NEXT_PUBLIC_API_URL Analysis

### ✅ **Correct Usage Found**
- **Location**: `src/lib/api-config.ts:2`
- **Implementation**:
  ```typescript
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://yourdomain.com/api'
  ```
- **Proper Prefix**: ✅ Uses `NEXT_PUBLIC_` for client-side access

### ⚠️ **Configuration Issues**

#### 1. **Placeholder Fallback Value**
```typescript
baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://yourdomain.com/api'
```

**Issue**: Fallback URL `https://yourdomain.com/api` is a placeholder  
**Impact**: API calls will fail if environment variable is not set  
**Recommendation**: Update to actual domain or remove fallback

#### 2. **Missing Environment Variable References**
- **Not found in**: `vercel.json` environment configuration
- **Risk**: Variable might not be set in production

### 🛠️ **Recommended Fixes**

```typescript
// OPTION 1: Environment-specific fallbacks
baseUrl: process.env.NEXT_PUBLIC_API_URL || (
  process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000/api' 
    : undefined
) || (() => { throw new Error('NEXT_PUBLIC_API_URL is required') })()

// OPTION 2: Update vercel.json
{
  "env": {
    "NEXTAUTH_URL": "https://zh-love.vercel.app",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "NEXT_PUBLIC_API_URL": "https://zh-love.vercel.app/api"
  }
}
```

---

## 🔍 3. Additional Environment Variables Found

### ✅ **NEXTAUTH_URL**
- **Location**: `vercel.json:5`
- **Value**: `"https://zh-love.vercel.app"`
- **Status**: ✅ Correctly configured for Vercel deployment

### ✅ **Other Process.env Usage**
- `NODE_ENV` - Correctly used in multiple files
- Prisma environment variables - Properly configured
- No naming inconsistencies found

---

## 🚨 4. Critical Deployment Issues

### ⚠️ **NextAuth + Static Export Conflict**

**Found in**: `next.config.js:5`
```javascript
output: 'export'  // This conflicts with NextAuth server-side functionality
```

**Issue**: Static export (`output: 'export'`) disables server-side features  
**Impact**: NextAuth requires server-side API routes to function  
**Status**: 🔴 **CRITICAL** - NextAuth will not work with static export

### 🛠️ **Resolution Required**

```javascript
// OPTION 1: Remove static export for NextAuth compatibility
const nextConfig = {
  // output: 'export', // Remove this line
  trailingSlash: true,
  // ... rest of config
}

// OPTION 2: Use conditional export
const nextConfig = {
  ...(process.env.STATIC_EXPORT === 'true' && { output: 'export' }),
  trailingSlash: true,
  // ... rest of config
}
```

---

## 📊 5. Missing Environment Files

### **Environment File Analysis**
- ✅ No `.env` files found in project (expected for Vercel)
- ✅ `.gitignore` properly excludes `.env` files
- ✅ `.vercelignore` properly excludes `.env` files

### **Missing .env Templates**
**Recommendation**: Create example files for developers

```bash
# Create these files:
.env.example
.env.local.example
```

---

## 🔧 6. Immediate Action Items

### 🔴 **Critical (Fix Immediately)**

1. **Fix NEXTAUTH_SECRET fallback**:
   ```typescript
   // Remove insecure fallback from production
   secret: process.env.NEXTAUTH_SECRET || (process.env.NODE_ENV === 'development' ? 'dev-secret' : undefined)
   ```

2. **Resolve Static Export Conflict**:
   ```javascript
   // Remove or conditionally apply output: 'export'
   ```

3. **Update API URL fallback**:
   ```typescript
   baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://zh-love.vercel.app/api'
   ```

### 🟡 **High Priority (Fix Soon)**

4. **Add NEXT_PUBLIC_API_URL to vercel.json**:
   ```json
   "NEXT_PUBLIC_API_URL": "https://zh-love.vercel.app/api"
   ```

5. **Create environment templates**:
   ```bash
   # .env.example
   NEXTAUTH_SECRET=your-32-character-secret-here
   NEXT_PUBLIC_API_URL=https://yourdomain.com/api
   ```

### 🟢 **Medium Priority (Recommended)**

6. **Add environment validation**:
   ```typescript
   // Create env validation utility
   function validateEnv() {
     if (process.env.NODE_ENV === 'production') {
       if (!process.env.NEXTAUTH_SECRET) {
         throw new Error('NEXTAUTH_SECRET is required in production')
       }
     }
   }
   ```

---

## 🏗️ 7. Deployment Recommendations

### **For Vercel Deployment**
1. ✅ Set `NEXTAUTH_SECRET` in Vercel Dashboard (already done via `@nextauth_secret`)
2. ❌ Add `NEXT_PUBLIC_API_URL` in Vercel Dashboard
3. ❌ Fix the static export configuration conflict

### **Environment Variable Settings in Vercel**
```bash
# In Vercel Dashboard > Settings > Environment Variables
NEXTAUTH_SECRET=<32-character-random-string>  # ✅ Already set
NEXTAUTH_URL=https://zh-love.vercel.app       # ✅ Already set  
NEXT_PUBLIC_API_URL=https://zh-love.vercel.app/api  # ❌ Missing
```

### **Regenerate NEXTAUTH_SECRET (Recommended)**
```bash
# Generate new secure secret
openssl rand -base64 32
# Or
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## ✅ 8. Summary & Final Recommendations

### **Current Status**
- ✅ Environment variables are used correctly in code
- ✅ No naming inconsistencies found
- ⚠️ Insecure fallback values present
- 🔴 Critical deployment configuration conflict

### **Immediate Actions Required**
1. **Security**: Remove insecure NEXTAUTH_SECRET fallback
2. **Functionality**: Fix static export conflict with NextAuth
3. **Configuration**: Add missing NEXT_PUBLIC_API_URL to Vercel
4. **Production**: Update API URL fallback to actual domain

### **Deployment Readiness**
**Current**: 🔴 **NOT READY** - Critical issues must be resolved  
**After Fixes**: 🟢 **READY** - All environment variables will be properly configured

### **Success Metrics**
- [ ] NextAuth authentication working in production
- [ ] API calls reaching correct endpoints
- [ ] No environment variable errors in logs
- [ ] Secure secrets with no fallbacks in production

---

**📞 Next Steps**: Address the critical issues above before deploying to production. The static export configuration is the most critical issue that will prevent NextAuth from functioning.