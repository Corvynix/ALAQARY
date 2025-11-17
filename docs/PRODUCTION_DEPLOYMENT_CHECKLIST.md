# Production Deployment Checklist

## Pre-Deployment (1-2 Weeks Before)

### Environment Setup
- [ ] All environment variables configured in production environment
  - [ ] `DATABASE_URL` (Neon PostgreSQL connection string)
  - [ ] `SESSION_SECRET` (strong random string, min 32 characters)
  - [ ] `ADMIN_INIT_SECRET` (NOT a placeholder value)
  - [ ] `SENTRY_DSN_SERVER` (optional but recommended)
  - [ ] `VITE_SENTRY_DSN_CLIENT` (optional but recommended)
  - [ ] `STRIPE_SECRET_KEY` (if using Stripe)
  - [ ] `STRIPE_WEBHOOK_SECRET` (if using Stripe)
  - [ ] `GEMINI_API_KEY` (for AI features)
  - [ ] `ALLOWED_ORIGINS` (comma-separated list of allowed origins)
  - [ ] `NODE_ENV=production`

### Database
- [ ] Production database created and accessible
- [ ] Database migrations run successfully (`npm run db:push`)
- [ ] Database backups configured
  - [ ] Automated daily backups enabled
  - [ ] Backup retention policy set (30 days recommended)
  - [ ] Test restore procedure documented
- [ ] Database connection pooling configured
- [ ] Admin user initialized (via ADMIN_INIT_SECRET)

### Security Audit
- [ ] All secrets removed from code
- [ ] `.env` file NOT committed to Git
- [ ] `.env.example` created with placeholder values
- [ ] Helmet.js security headers configured
- [ ] CORS properly configured (whitelist only trusted domains)
- [ ] Rate limiting enabled and tested
- [ ] Session security configured (secure cookies, HTTP-only)
- [ ] npm audit run and critical vulnerabilities fixed
- [ ] SQL injection prevention verified (using Drizzle ORM)
- [ ] XSS protection verified

### Testing
- [ ] Unit tests passing (run `npm test`)
- [ ] Integration tests passing
- [ ] E2E tests passing (critical user flows)
- [ ] Manual testing of critical paths:
  - [ ] User registration/login
  - [ ] Booking consultation
  - [ ] Payment processing
  - [ ] Admin dashboard access
  - [ ] Developer property management
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness tested (iOS, Android)
- [ ] RTL (Arabic) layout tested
- [ ] Load testing performed (100+ concurrent users)

### Monitoring & Error Tracking
- [ ] Sentry configured and tested
  - [ ] Backend errors captured
  - [ ] Frontend errors captured
  - [ ] Source maps uploaded
  - [ ] Alert rules configured
- [ ] Health check endpoints accessible (`/health`, `/health/ready`)
- [ ] Logging configured (Pino with appropriate log levels)
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured (UptimeRobot, Pingdom, etc.)

### Performance
- [ ] Bundle size analyzed and optimized
- [ ] Images optimized (compression, responsive sizes)
- [ ] Lazy loading implemented for routes
- [ ] Database queries optimized (indexes added)
- [ ] Compression middleware enabled
- [ ] CDN configured for static assets (if applicable)
- [ ] Cache headers configured appropriately

### Legal & Compliance
- [ ] Privacy Policy page accessible (`/privacy-policy`)
- [ ] Terms of Service page accessible (`/terms-of-service`)
- [ ] Cookie consent banner functional
- [ ] GDPR compliance verified (if applicable)
- [ ] Data retention policy implemented
- [ ] User data export functionality (if required)
- [ ] User data deletion functionality (if required)

### Documentation
- [ ] API documentation complete and accurate
- [ ] Deployment documentation written
- [ ] Runbook for common operations created
- [ ] Incident response plan documented
- [ ] Team contacts and escalation paths defined

## Deployment Day

### Pre-Deployment Verification
- [ ] Code review completed and approved
- [ ] All tests passing on main branch
- [ ] Database backup taken (just before deployment)
- [ ] Deployment window communicated to stakeholders
- [ ] Rollback plan prepared

### Deployment Steps
1. [ ] Set `NODE_ENV=production`
2. [ ] Install dependencies (`npm install --production`)
3. [ ] Run database migrations (`npm run db:push`)
4. [ ] Build application (`npm run build`)
5. [ ] Upload source maps to Sentry (if configured)
6. [ ] Deploy to production server
7. [ ] Verify deployment configuration

### Post-Deployment Verification
- [ ] Health check endpoint returns 200 (`/health`)
- [ ] Readiness check endpoint returns 200 (`/health/ready`)
- [ ] Homepage loads successfully
- [ ] User login/logout works
- [ ] Critical user flows tested:
  - [ ] Book consultation
  - [ ] Process payment
  - [ ] Admin login
  - [ ] Create property (developer)
- [ ] Error tracking working (test with intentional error)
- [ ] Performance monitoring active
- [ ] Logs being written correctly
- [ ] Database queries executing properly
- [ ] Session management working
- [ ] HTTPS certificate valid
- [ ] Security headers present (check with securityheaders.com)

### Monitoring First 24 Hours
- [ ] Monitor error rates in Sentry
- [ ] Check server resource usage (CPU, memory)
- [ ] Monitor database connections and query performance
- [ ] Track API response times
- [ ] Monitor user feedback channels
- [ ] Check log aggregation for warnings/errors

## Post-Deployment (First Week)

### Performance Monitoring
- [ ] Review average response times
- [ ] Check 95th percentile response times
- [ ] Identify slow queries and optimize
- [ ] Monitor database query patterns
- [ ] Check for memory leaks

### User Feedback
- [ ] Collect and review user feedback
- [ ] Monitor support tickets/emails
- [ ] Track user satisfaction metrics
- [ ] Identify and prioritize bug fixes

### Optimization
- [ ] Review error rates and fix critical bugs
- [ ] Optimize slow endpoints
- [ ] Fine-tune rate limiting if needed
- [ ] Adjust caching strategies based on usage

## Ongoing Maintenance

### Daily
- [ ] Check error rates in Sentry
- [ ] Review critical alerts
- [ ] Monitor uptime
- [ ] Check backup completion

### Weekly
- [ ] Review performance metrics
- [ ] Update dependencies (security patches)
- [ ] Review user feedback
- [ ] Check database growth and optimize

### Monthly
- [ ] Full security audit
- [ ] Load testing
- [ ] Review and update documentation
- [ ] Disaster recovery drill
- [ ] Review and optimize costs

## Rollback Plan

If critical issues arise:

1. **Immediate Actions**
   - [ ] Stop deployment process
   - [ ] Assess severity and impact
   - [ ] Communicate to stakeholders

2. **Rollback Steps**
   - [ ] Deploy previous version
   - [ ] Restore database backup (if schema changed)
   - [ ] Clear application cache
   - [ ] Verify rollback successful
   - [ ] Monitor for stability

3. **Post-Rollback**
   - [ ] Document issue that caused rollback
   - [ ] Create hotfix plan
   - [ ] Schedule new deployment

## Emergency Contacts

- **Technical Lead:** [Name, Phone, Email]
- **DevOps:** [Name, Phone, Email]
- **Database Admin:** [Name, Phone, Email]
- **On-Call Engineer:** [Rotation schedule/contact]

## Success Criteria

Deployment is considered successful when:

- [ ] 99.9% uptime for 7 days
- [ ] Error rate < 0.1%
- [ ] Average response time < 500ms
- [ ] Zero critical bugs reported
- [ ] No performance degradation
- [ ] No data loss incidents
- [ ] Positive user feedback

## Notes

- Always deploy during low-traffic hours
- Have at least 2 engineers available during deployment
- Keep communication channels open
- Document any deviations from this checklist
- Update checklist based on lessons learned

---

**Version:** 1.0  
**Last Updated:** November 17, 2025  
**Next Review:** After first production deployment
