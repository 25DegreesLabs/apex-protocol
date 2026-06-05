/**
 * useApexPlaybook.js — Apex Protocol Plan Data Layer
 *
 * Provides read-only access to the Emmanuel structured training plan JSON files.
 * This is the replacement for the legacy usePlaybook.js / playbook.csv system.
 *
 * Current plans loaded:
 *   phase1 → src/data/plan-phase1.json
 *
 * API:
 *   getDay(blockId, dayNumber)  → DayObject | null
 *   getBlock(blockId)           → BlockObject | null
 *   getExercise(id)             → ExerciseObject | null  (cross-day lookup by stable id)
 *
 * This hook does NOT touch state, the DB, the HUD, or the webhook.
 * It is purely a read-only data accessor.
 *
 * Usage (read-only, not yet wired into the UI):
 *   import { useApexPlaybook } from '../hooks/useApexPlaybook'
 *   const { getDay, getBlock } = useApexPlaybook()
 *   const day1 = getDay('phase1', 1)
 */

import phase1Plan from '../data/plan-phase1.json'

// ─── Plan registry ─────────────────────────────────────────────────────────────
// Add new phase JSON files here when they are created.
const PLAN_REGISTRY = {
    phase1: phase1Plan
}

// ─── Helper: resolve a plan by blockId ────────────────────────────────────────
function resolvePlan(blockId) {
    return PLAN_REGISTRY[blockId] ?? null
}

// ─── getBlock ─────────────────────────────────────────────────────────────────
/**
 * Returns the full block plan object for a given blockId.
 * Returns null if the blockId is not registered.
 *
 * @param {string} blockId - e.g. "phase1"
 * @returns {Object|null}
 */
export function getBlock(blockId) {
    return resolvePlan(blockId)
}

// ─── getDay ───────────────────────────────────────────────────────────────────
/**
 * Returns the day object for a given blockId and dayNumber.
 *
 * - Returns null if the blockId is not registered.
 * - Returns null if the day key does not exist in the plan.
 * - Returns null explicitly for rest days (days whose object has no exercises
 *   or whose dayType is "rest").
 *
 * @param {string} blockId    - e.g. "phase1"
 * @param {number|string} dayNumber - e.g. 1 or "1"
 * @returns {Object|null}
 */
export function getDay(blockId, dayNumber) {
    const plan = resolvePlan(blockId)
    if (!plan) return null

    const day = plan.days[String(dayNumber)] ?? null
    return day
}

// ─── isRestDay ────────────────────────────────────────────────────────────────
/**
 * Returns true if the given day is a rest or recovery day (no exercises).
 *
 * @param {string} blockId
 * @param {number|string} dayNumber
 * @returns {boolean}
 */
export function isRestDay(blockId, dayNumber) {
    const day = getDay(blockId, dayNumber)
    if (!day) return true
    return day.dayType === 'rest' || day.dayType === 'recovery'
}

// ─── getExercise ──────────────────────────────────────────────────────────────
/**
 * Looks up a single exercise by its stable id across all days in a plan.
 * Useful for history lookups keyed by exercisePlanId.
 *
 * @param {string} blockId - e.g. "phase1"
 * @param {string} exerciseId - e.g. "p1-d1-ex1"
 * @returns {Object|null}
 */
export function getExercise(blockId, exerciseId) {
    const plan = resolvePlan(blockId)
    if (!plan) return null

    for (const dayKey of Object.keys(plan.days)) {
        const day = plan.days[dayKey]
        if (!day || !Array.isArray(day.exercises)) continue
        const found = day.exercises.find(ex => ex.id === exerciseId)
        if (found) return found
    }
    return null
}

// ─── useApexPlaybook hook ──────────────────────────────────────────────────────
/**
 * React hook that exposes the Apex Protocol plan data accessors.
 *
 * Returns a stable object of read-only functions.
 * No React state or side effects are introduced — the returned functions
 * are pure lookups against the imported JSON.
 *
 * @returns {{ getBlock, getDay, isRestDay, getExercise }}
 */
export function useApexPlaybook() {
    return {
        getBlock,
        getDay,
        isRestDay,
        getExercise
    }
}

export default useApexPlaybook
