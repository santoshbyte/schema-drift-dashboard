export function normalizeDetectedChange(detectedChange) {
  if (Array.isArray(detectedChange)) return detectedChange;
  if (detectedChange) return [detectedChange];
  return [];
}

export function decisionClass(decision) {
  switch (decision) {
    case 'AUTO_RELEASE':
      return 'badge-success';
    case 'NEEDS_APPROVAL':
      return 'badge-warning';
    case 'REJECT':
      return 'badge-danger';
    default:
      return '';
  }
}

export function pillClass(decision) {
  switch (decision) {
    case 'AUTO_RELEASE':
      return 'pill-success';
    case 'NEEDS_APPROVAL':
      return 'pill-warning';
    case 'REJECT':
      return 'pill-danger';
    default:
      return '';
  }
}