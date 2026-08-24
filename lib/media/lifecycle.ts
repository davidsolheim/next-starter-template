export type MediaLifecycleInput = {
  archivedAt: Date | null
  usageCount: number
  untrackedUrlRefs: number
}

export function mediaLifecycle(input: MediaLifecycleInput) {
  const usageCount = input.usageCount + input.untrackedUrlRefs
  const canPurge = Boolean(input.archivedAt) && usageCount === 0
  return {
    usageCount,
    hasUntrackedUrlRefs: input.untrackedUrlRefs > 0,
    canPurge,
  }
}
