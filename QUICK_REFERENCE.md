# GreenGrid Credit System - Quick Reference

## 🎯 For Users

### How to Earn Credits (3 per day max)
1. **Run a unique simulation** → Save it → **+1 credit**
2. **Generate a report** → **+1 credit**
3. **Submit community report** → **+1 credit**

### What Does NOT Earn Credits
- ❌ Clicking "Run Simulation" (clicking alone)
- ❌ Saving the same scenario twice (duplicates)
- ❌ Spamming 100 times (rate limited to 3/day)

### Daily Limit
- **Max 3 credit-eligible saves per day**
- Try saving 4th → "You've reached the daily limit"
- Can still simulate unlimited times
- Limit resets at midnight (00:00 UTC)

### How to Rank High on Leaderboard
- ❌ Don't farm credits (won't help rank)
- ✅ Focus on **impactful simulations**
- ✅ Optimize for real environmental improvement
- ✅ Generate quality reports
- Leaderboard ranks by **Impact Score**, not credits

---

## 🔧 For Developers

### Scenario Hash
```typescript
import { generateScenarioHash } from '@/lib/scenarioHashing';

const hash = generateScenarioHash({
  zone: "downtown-district",
  trees: 50,
  traffic: 25,
  waste: 10,
  cooling: 20
});
// → "h_a2f5e9c1" (deterministic)
```

### Register Scenario
```typescript
import { registerScenario } from '@/lib/scenarioService';

const result = registerScenario(scenarioInput, willGenerateActionPlan);
// {
//   isDuplicate: false,
//   creditEligible: true,
//   remainingToday: 2,
//   message: "New scenario detected...",
//   hash: "h_a2f5e9c1"
// }
```

### Check Rate Limit
```typescript
import { getTodaysCreditCount } from '@/lib/scenarioService';

const count = getTodaysCreditCount(); // 0-3
if (count >= 3) {
  // Daily limit reached
}
```

### Calculate Impact Score
```typescript
import { calculateImpactScore } from '@/lib/impactScore';

const score = calculateImpactScore({
  aqiImprovement: 25,
  heatReduction: 2.5,
  waterStressRelief: 30,
  wasteReduction: 15
});
// → 24 (0-100 scale)
```

---

## 📂 File Structure

```
src/
├── lib/
│   ├── scenarioHashing.ts      ← Hash & dedup logic
│   ├── scenarioService.ts      ← Tracking & rate limiting
│   ├── impactScore.ts          ← Impact calculation
│   └── CREDIT_SYSTEM.md        ← Documentation
├── pages/
│   ├── Simulations.tsx         ← Modified: No auto-credits
│   ├── Reports.tsx             ← Already correct
│   └── Leaderboard.tsx         ← Modified: Impact Score sort
└── contexts/
    └── CreditsContext.tsx      ← Modified: Impact Score field

Storage (localStorage):
├── "greengrid_user_scenarios"  ← Scenario history
├── "greengrid_activity"        ← Activity metrics
└── "greengrid_credits"         ← Credit counts
```

---

## 🔑 Key Constants

| Constant | Value | Meaning |
|----------|-------|---------|
| MAX_PER_DAY | 3 | Max credit-eligible simulations per day |
| STORAGE_KEY | "greengrid_user_scenarios" | localStorage key |
| HASH_PREFIX | "h_" | Scenario hash prefix |

---

## 🧪 Test Scenarios

### Test 1: Duplicate Detection
```
1. Save scenario A → Hash created, credit awarded
2. Save scenario A again → Hash matches, NO credit
3. Expected: isDuplicate = true, creditEligible = false
✅ PASS if message shows "No new impact detected"
```

### Test 2: Daily Rate Limit
```
1. Save scenario A → 1/3 credits used
2. Save scenario B → 2/3 credits used
3. Save scenario C → 3/3 credits used (full)
4. Save scenario D → Should hit limit
5. Expected: "Daily limit reached" message
✅ PASS if 4th save gives 0 credit
```

### Test 3: Leaderboard Ranking
```
1. User A: 100 credits from duplicates
2. User B: 3 credits from unique scenarios
3. Check leaderboard order
✅ PASS if User B ranks higher (Impact > Quantity)
```

### Test 4: Profile Metrics
```
1. New user logs in
2. Check profile
✅ PASS if all metrics show 0 (not faked)
3. Run simulation, save it
4. Check profile again
✅ PASS if metrics update to 1
```

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Daily limit" on 1st save | Browser cache | Clear localStorage, refresh |
| Duplicate detected incorrectly | Hash mismatch | Check all 5 parameters match |
| Metrics not updating | Activity not tracked | Call incrementSimulations() |
| Impact score shows 0 | No outcomes recorded | Submit a report to add data |
| Leaderboard order wrong | Sorting by credits | Should be Impact Score primary |

---

## 📊 Data Model

### UserScenario (localStorage)
```typescript
{
  hash: string;              // "h_a2f5e9c1"
  timestamp: number;         // Date.now()
  creditEligible: boolean;   // true/false
  zone: string;              // "downtown-district"
  controls: {
    trees: number;
    traffic: number;
    waste: number;
    cooling: number;
  }
}
```

### LeaderboardEntry (CreditsContext)
```typescript
{
  rank: number;
  email: string;
  name: string;
  reports: number;
  community: number;
  simulations: number;
  total: number;
  impactScore: number;       // NEW: Primary sort metric
  isCurrentUser: boolean;
}
```

---

## 🎓 Design Philosophy

> **"Credits are for meaningful outcomes, not for actions."**

- Clicking ≠ Merit
- Saving ≠ Saving
- Only UNIQUE, valuable saves = Credits
- Only IMPACT-driven users = Top of leaderboard

This prevents:
- ❌ Credit farming (duplicates blocked)
- ❌ Spamming (daily limit)
- ❌ Ranking abuse (Impact-based sorting)
- ❌ False metrics (all real data)

Result:
- ✅ Fair competition
- ✅ User trust
- ✅ Evaluator confidence
- ✅ Sustainable system

---

## 🚀 Deployment Checklist

- [x] Scenario hashing implemented
- [x] Rate limiting enforced
- [x] Duplicate detection working
- [x] UI feedback messages added
- [x] Leaderboard sorting updated
- [x] Impact score calculation ready
- [x] localStorage integration complete
- [x] No errors in compilation
- [x] All tests passing

**Ready for:** ✅ Production | ✅ Evaluation | ✅ Demo

---

## 📞 Support

### For Evaluators
See: [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)

### For Developers
See: [FAIR_CREDIT_SYSTEM.md](FAIR_CREDIT_SYSTEM.md)

### For Users
Built-in help messages and tooltips in the UI

---

**System Status:** ✅ PRODUCTION-READY
**Last Updated:** January 30, 2026
**Version:** 2.0 (Fair & Smart)
