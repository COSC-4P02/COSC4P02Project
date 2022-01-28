export const normalizeSlot = (name, scope = {}, $scopedSlots = {}, $slots = {}) => {
    const slot = $scopedSlots[name] || $slots[name]
    return typeof slot === 'function' ? slot(scope) : slot
}
