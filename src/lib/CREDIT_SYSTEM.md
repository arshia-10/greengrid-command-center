/**
 * GreenGrid Credit & Impact System
 * 
 * PHILOSOPHY:
 * Credits are awarded for MEANINGFUL, IMPACTFUL actions, not for repeated clicks.
 * This prevents gaming and ensures fair leaderboard rankings.
 * 
 * ============================================================================
 * CREDIT AWARD LOGIC
 * ============================================================================
 * 
 * Credits are AWARDED for:
 * ✅ Saving a UNIQUE simulation scenario (new parameter combination)
 * ✅ Generating/Exporting a Report
 * ✅ Submitting a Community Report
 * ✅ Completing an Action Plan
 * 
 * Credits are NOT awarded for:
 * ❌ Simply running a simulation
 * ❌ Clicking "Run" multiple times on same scenario
 * ❌ Repeated simulations (duplicate scenario hash)
 * 
 * ============================================================================
 * RATE LIMITING
 * ============================================================================
 * 
 * Daily Credit Limit: 3 credit-eligible simulations per day
 * - After 3 unique scenarios are saved, further saves don't award credits
 * - User can still simulate unlimited times, but credits cap at 3/day
 * - Resets at midnight (00:00 UTC)
 * 
 * ============================================================================
 * SCENARIO DEDUPLICATION
 * ============================================================================
 * 
 * Scenario Hash = md5(zone + trees + traffic + waste + cooling)
 * - If same hash was saved before, it's a duplicate
 * - Duplicates don't award credits
 * - Users can save duplicates for personal reference
 * - Message: "No new impact detected. Try a different intervention."
 * 
 * ============================================================================
 * LEADERBOARD RANKING
 * ============================================================================
 * 
 * PRIMARY METRIC: Impact Score
 * Impact Score = weighted average of:
 *   - AQI Improvement (30%)
 *   - Heat Reduction (25%)
 *   - Water Stress Relief (25%)
 *   - Waste Reduction (20%)
 * 
 * SECONDARY METRIC: Credits (tiebreaker)
 * 
 * This prevents credit farming and rewards users who actually improve environment.
 * 
 * ============================================================================
 * USER ACTIVITY TRACKING
 * ============================================================================
 * 
 * ActivityContext tracks:
 * - simulationsRun (total count, includes all runs)
 * - reportsGenerated (unique reports submitted)
 * - activeDays (unique days with actions)
 * - impactScore (calculated from simulation outcomes)
 * 
 * Profile shows ONLY real metrics:
 * - Simulations Run (actual count)
 * - Reports Generated (actual count)
 * - Active Days (actual unique days)
 * - Impact Score (calculated, not fake)
 * 
 * Zero-state for new users (0 simulations + 0 reports):
 * - Shows welcome message
 * - CTA: "Run Your First Simulation"
 * - No fake metrics
 * 
 * ============================================================================
 * IMPLEMENTATION CHECKLIST
 * ============================================================================
 * 
 * [✓] ScenarioService.ts - Deduplication & rate limiting
 * [✓] ImpactScore.ts - Leaderboard ranking calculation
 * [✓] Simulations.tsx - No credits on simple run, check scenario on save
 * [✓] Reports.tsx - Credits awarded for actual report generation
 * [✓] UI tooltips - "Credits for unique actions only"
 * [ ] Leaderboard.tsx - Sort by Impact Score (primary), Credits (secondary)
 * [ ] Profile.tsx - Verify zero-state, show real metrics only
 * 
 * ============================================================================
 */

export const CREDIT_SYSTEM_NOTES = `
GreenGrid Credit System v2.0 - Fair, Non-Gameable

1. Simulations alone don't earn credits
2. Save unique scenarios to earn 1 credit each (max 3/day)
3. Generate reports to earn 1 credit each
4. Leaderboard ranks by Impact Score, not raw credits
5. All user metrics are real, no hardcoded values
`;
