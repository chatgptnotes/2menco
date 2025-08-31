# 📋 BETTROI BOS - Standard Operating Procedures (SOPs)

**Step-by-step instructions for your robot teams** • Version 1.0 • August 29, 2025 • Asia/Dubai

---

## 🎯 What are SOPs?

**SOPs** = Standard Operating Procedures. Think of them as instruction manuals that tell your robot teams exactly what to do, when to do it, and how to do it safely!

---

## 🔄 DOR (Daily Operating Rhythm) - The Daily Check-In

### Morning Command Center Dashboard (CCD)
**When:** Every morning at 9:00 AM Dubai time
**Robot Boss:** Digital COO
**Goal:** Check if everything is running smoothly

**Step-by-Step:**
1. **Check Incidents** - Look for any problems that happened overnight
2. **Review Spend** - Check if we're spending money wisely
3. **KPI Deltas** - See if our numbers are going up or down
4. **Exceptions Only** - Only review things that are unusual
5. **Agent SLOs** - Check if robots are doing their jobs well
6. **Drift Alert** - If quality drops >5%, sound the alarm
7. **Cost Spikes** - If spending jumps suddenly, investigate

**Human Check Needed When:**
- SEV-1/2 incidents (something breaks badly)
- KPI variance > ±10%
- Security problems
- Robots disagree with each other

---

## 🌍 UTI (Universe → Inquiry) - Finding New Customers

### Refresh Customer Lists
**When:** Every Monday morning
**Robot Boss:** Digital CMO / Digital CRO
**Goal:** Find people who might want to buy from you

**Step-by-Step:**
1. **Update ICP Scoring** - Refresh our "ideal customer" list
2. **Named Accounts** - Update list of companies we want to work with
3. **Outreach Cadence** - Send emails/WhatsApp/LinkedIn messages
4. **Frequency Caps** - Don't spam! Max 2 emails + 1 WhatsApp/week per contact
5. **Opt-out Respect** - If someone says "stop," stop immediately
6. **Ads/SEO Experiments** - Try new ways to find customers
7. **Pipeline KPI** - Track how many potential customers we find

**Human Check Needed When:**
- Trying new customer types
- Making big marketing promises
- Could hurt our reputation
- Spending more than usual on ads

---

## 💼 ITP (Inquiry → Proposal) - Making Offers

### Turn Interest into Proposals
**When:** Within 24 hours of receiving interest
**Robot Boss:** Digital CRO / Digital CPO
**Goal:** Turn interested people into paying customers

**Step-by-Step:**
1. **Auto-Structured Discovery** - Ask the right questions automatically
2. **CPQ Guardrails** - Use our pricing rules (no random discounts!)
3. **Proposal Composer** - Create offers using latest templates
4. **SoW Templates** - Use standard "Statement of Work" formats
5. **Pricing Rules** - Follow our approved pricing
6. **Non-Standard Terms** - If customer wants something unusual, ask Seller
7. **Win/Loss Tracking** - Record what works and what doesn't

**Human Check Needed When:**
- Giving discounts bigger than allowed
- Changing important terms
- New type of customer
- Robot isn't sure what to do

---

## 📋 PTO (Proposal → Order) - Getting Orders

### Turn Proposals into Orders
**When:** Within 48 hours of proposal acceptance
**Robot Boss:** Digital COO / Digital CFO
**Goal:** Turn proposals into actual orders

**Step-by-Step:**
1. **Contract Generation** - Create contracts automatically
2. **Red-Line Diff** - Show exactly what changed from standard
3. **Audit Trail** - Keep track of all changes
4. **Vendor Due-Diligence** - Check if suppliers are reliable
5. **Compliance Flags** - Make sure we follow all rules
6. **Project Kickoff Pack** - Create everything needed to start work
7. **Execution Board** - Set up project tracking

**Human Check Needed When:**
- Working with new vendors
- Unusual contract terms
- Big changes from standard
- Compliance issues

---

## 💰 OTI (Order → Invoice) - Getting Paid

### Turn Orders into Cash
**When:** Immediately after order confirmation
**Robot Boss:** Digital CFO
**Goal:** Get money in the bank quickly

**Step-by-Step:**
1. **Milestone Billing** - Bill when work is done
2. **Monthly Billing** - For ongoing services
3. **Invoice Bot** - Create and send invoices automatically
4. **Collections Bot** - Follow up on late payments
5. **Dunning Process** - Polite reminders for overdue invoices
6. **Disputes Escalate** - If customer has problems, ask Seller
7. **Daily Reconciliation** - Check if money matches invoices

**Human Check Needed When:**
- Payments ≥ AED 10,000 (dual-control needed)
- Payment looks suspicious
- Customer disputes
- Collection problems

---

## 😊 ECH (Ensuring Customer Happiness) - Happy Customers

### Keep Customers Happy and Coming Back
**When:** Throughout the customer relationship
**Robot Boss:** Digital CXO
**Goal:** Make customers so happy they tell their friends

**Step-by-Step:**
1. **Onboarding Runbook** - Help new customers get started
2. **Adoption Score** - Track how much customers use our product
3. **QBR Decks** - Create quarterly business review presentations
4. **Value Metrics** - Show customers the value they're getting
5. **Churn-Watch** - Look for signs customers might leave
6. **Save-Plays** - Try to keep customers who want to leave
7. **Exit Interviews** - Learn from customers who do leave

**Human Check Needed When:**
- Customer complaints
- Need legal/financial advice
- Robot isn't confident
- Customer wants to leave

---

## 🔄 Cross-Cutting SOPs (Apply to Everything)

### Agent Lifecycle
**How robots get hired and managed:**

1. **Proposal** - Robot applies for the job
2. **Sandbox/Red-Team** - Test robot in safe environment
3. **Policy Review** - Make sure robot follows all rules
4. **DPIA/DPA** - Check privacy and data protection
5. **Staged Rollout** - Start with 10 users, then 50, then 100
6. **Observability** - Watch how robot performs
7. **Quarterly Recert** - Check robot every 3 months

### Prompt/Config Changes
**How to update robot instructions safely:**

1. **Pull Request (PR)** - Submit changes for review
2. **Golden Tests** - Make sure changes don't break anything
3. **Changelog** - Document what changed
4. **Auto-Rollback Tag** - Be able to undo changes quickly

### Data Handling
**How to protect customer information:**

1. **Classify** - Label data as L0-L5 (public to super secret)
2. **Minimization** - Only collect what you need
3. **Masking** - Hide sensitive information in logs
4. **Lineage** - Track where data came from
5. **Residency** - Keep data in allowed countries

### Incident Response
**What to do when something goes wrong:**

1. **SEV-1..4** - Rate how bad the problem is (1=worst, 4=minor)
2. **Triage 15 min** - Figure out what's wrong within 15 minutes
3. **SEV-1/2 Contain ≤ 1 hour** - Stop bad problems within 1 hour
4. **Postmortem 48 hours** - Write report within 2 days

### Vendor/Model Upgrades
**How to improve robots safely:**

1. **Model BOM** - List what models we're using
2. **A/B Acceptance** - Test new models against old ones
3. **KPIs ≥ Baseline** - Only use if performance is as good or better
4. **Spend Within Budget** - Don't spend more than planned

### Business Continuity (BCDR)
**How to keep running if something breaks:**

1. **RTO ≤ 4h** - Get back up within 4 hours
2. **RPO ≤ 1h** - Don't lose more than 1 hour of data
3. **Quarterly Restore Drills** - Practice recovery every 3 months

---

## 📊 Default Thresholds (Edit for BETTROI)

- **Payments dual-control** ≥ AED 10,000
- **New vendor** requires Seller approval + compliance checklist
- **Outreach caps** 2 emails + 1 WhatsApp/week/contact (unless opted-in)
- **Model drift alert** quality drop > 5% vs golden set
- **L5 processing** only with contract + consent + residency

---

**Remember:** These SOPs are like recipes for your robot chefs! Follow them exactly, and your digital business will run smoothly! 🤖✨
