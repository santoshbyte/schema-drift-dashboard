export function evaluateDecision({
  semanticMatch,
  validationResult
}) {
  if (
    !validationResult ||
    validationResult.validation_result !== 'pass'
  ) {
    return {
      decision: 'REJECT',
      reason:
        'Validation failed. The proposed mapping repair cannot be released.'
    };
  }

  if (!semanticMatch) {
    return {
      decision: 'REJECT',
      reason:
        'No semantic classification is available.'
    };
  }

  const confidence = Number(
    semanticMatch.confidence
  );

  const matchType =
    semanticMatch.match_type;

  if (
    confidence >= 90 &&
    ['exact', 'strong'].includes(matchType)
  ) {
    return {
      decision: 'AUTO_RELEASE',
      reason:
        `High confidence (${confidence}%) ${matchType} match and validation passed.`
    };
  }

  if (confidence >= 50) {
    return {
      decision: 'NEEDS_APPROVAL',
      reason:
        `Moderate confidence (${confidence}%). Developer approval is required before release.`
    };
  }

  return {
    decision: 'REJECT',
    reason:
      `Low confidence (${confidence}%) ${matchType} match.`
  };
}