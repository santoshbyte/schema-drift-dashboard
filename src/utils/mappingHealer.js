// export function normalizeMapping(mappingData) {
//   if (!mappingData) {
//     throw new Error('Mapping data is empty.');
//   }

//   // Preferred format:
//   // { mappings: [{ source, target }, ...] }
//   if (Array.isArray(mappingData.mappings)) {
//     return mappingData.mappings.map((mapping) => ({
//       source: mapping.source,
//       target: mapping.target
//     }));
//   }

//   // Backward-compatible format:
//   // { "empName": "EmployeeName", ... }
//   if (
//     typeof mappingData === 'object' &&
//     !Array.isArray(mappingData)
//   ) {
//     return Object.entries(mappingData).map(
//       ([source, target]) => ({
//         source,
//         target
//       })
//     );
//   }

//   throw new Error(
//     'Unsupported mapping format.'
//   );
// }

// export function generateMappingRepair({
//   mappingData,
//   oldSourceField,
//   newSourceField,
//   matchType,
//   confidence
// }) {
//   if (
//     !['exact', 'strong'].includes(matchType)
//   ) {
//     return {
//       action: 'no_repair_generated',
//       reason:
//         `Match type '${matchType}' is not safe enough for automatic repair.`,
//       original_mapping:
//         normalizeMapping(mappingData),
//       repaired_mapping: null
//     };
//   }

//   const originalMapping =
//     normalizeMapping(mappingData);

//   const repairedMapping =
//     originalMapping.map((mapping) => {
//       if (mapping.source === oldSourceField) {
//         return {
//           ...mapping,
//           source: newSourceField
//         };
//       }

//       return mapping;
//     });

//   const affectedMapping =
//     originalMapping.find(
//       (mapping) =>
//         mapping.source === oldSourceField
//     );

//   if (!affectedMapping) {
//     return {
//       action: 'no_repair_generated',
//       reason:
//         `Original mapping does not contain source field '${oldSourceField}'.`,
//       original_mapping: originalMapping,
//       repaired_mapping: null
//     };
//   }

//   const duplicateSource =
//     repairedMapping.filter(
//       (mapping) =>
//         mapping.source === newSourceField
//     ).length > 1;

//   if (duplicateSource) {
//     return {
//       action: 'no_repair_generated',
//       reason:
//         `Repaired source field '${newSourceField}' would create duplicate mappings.`,
//       original_mapping: originalMapping,
//       repaired_mapping: null
//     };
//   }

//   return {
//     action: 'repair_generated',

//     confidence,

//     before: {
//       source_field: oldSourceField,
//       target_field: affectedMapping.target
//     },

//     after: {
//       source_field: newSourceField,
//       target_field: affectedMapping.target
//     },

//     original_mapping: originalMapping,

//     repaired_mapping: repairedMapping
//   };
// }

export function normalizeMapping(mappingData) {
  if (!mappingData) throw new Error('Mapping data is empty.');

  if (Array.isArray(mappingData.mappings)) {
    return mappingData.mappings.map((m) => ({
      source: m.source,
      target: m.target,
      ...m,
    }));
  }

  if (typeof mappingData === 'object' && !Array.isArray(mappingData)) {
    return Object.entries(mappingData).map(([source, target]) => ({
      source,
      target,
    }));
  }

  throw new Error('Unsupported mapping format.');
}

function isSafeSemanticMatch(match) {
  return (
    match &&
    ['exact', 'strong'].includes(match.match_type) &&
    Number(match.confidence) >= 50 &&
    Boolean(match.matched_field)
  );
}

export function generateMappingRepair({
  mappingData,
  detectedChanges = [],
  semanticMatches = [],
}) {
  const originalMapping = normalizeMapping(mappingData);
  const repairedMapping = originalMapping.map((mapping) => ({ ...mapping }));
  const semanticBySource = new Map(
    semanticMatches.map((match) => [match.removed_field, match])
  );

  const usedNewFields = new Set();
  const healed = [];
  const unresolved = [];

  for (const change of detectedChanges) {
    if (change.change_type !== 'field_removed') continue;

    const match = semanticBySource.get(change.field);
    const mappingIndex = repairedMapping.findIndex(
      (mapping) => mapping.source === change.field
    );

    if (mappingIndex < 0) {
      unresolved.push({
        source_field: change.field,
        reason: `No existing mapping entry references '${change.field}'.`,
        match,
      });
      continue;
    }

    if (!isSafeSemanticMatch(match)) {
      unresolved.push({
        source_field: change.field,
        reason: `Semantic match for '${change.field}' is not safe for automatic healing.`,
        match,
      });
      continue;
    }

    const newSourceField = match.matched_field;

    if (usedNewFields.has(newSourceField)) {
      unresolved.push({
        source_field: change.field,
        reason: `Candidate '${newSourceField}' has already been assigned to another mapping.`,
        match,
      });
      continue;
    }

    const duplicateExisting = repairedMapping.some(
      (mapping, index) =>
        index !== mappingIndex && mapping.source === newSourceField
    );

    if (duplicateExisting) {
      unresolved.push({
        source_field: change.field,
        reason: `Candidate '${newSourceField}' already exists in another mapping entry.`,
        match,
      });
      continue;
    }

    const before = { ...repairedMapping[mappingIndex] };
    repairedMapping[mappingIndex] = {
      ...repairedMapping[mappingIndex],
      source: newSourceField,
    };
    const after = { ...repairedMapping[mappingIndex] };

    usedNewFields.add(newSourceField);
    healed.push({
      source_field: change.field,
      target_field: before.target,
      new_source_field: newSourceField,
      target: after.target,
      match_type: match.match_type,
      confidence: Number(match.confidence),
      reasoning: match.reasoning,
    });
  }

  const typeChanges = detectedChanges
    .filter((change) => change.change_type === 'type_changed')
    .map((change) => ({
      field: change.field,
      old_type: change.old_type,
      new_type: change.new_type,
    }));

  const removedSources = new Set(
    detectedChanges
      .filter((change) => change.change_type === 'field_removed')
      .map((change) => change.field)
  );

  const mappingRows = repairedMapping.map((mapping) => {
    const healedRow = healed.find(
      (item) => item.new_source_field === mapping.source && item.target === mapping.target
    );

    if (healedRow) {
      return {
        ...mapping,
        status: 'healed',
        previous_source: healedRow.source_field,
        match_type: healedRow.match_type,
        confidence: healedRow.confidence,
      };
    }

    if (removedSources.has(mapping.source)) {
      return {
        ...mapping,
        status: 'unresolved',
      };
    }

    return {
      ...mapping,
      status: 'unchanged',
    };
  });

  const activeSemanticMatches = semanticMatches.filter(
    (match) => match.match_type && match.match_type !== 'error'
  );

  const averageConfidence = activeSemanticMatches.length
    ? Math.round(
        activeSemanticMatches.reduce(
          (sum, match) => sum + Number(match.confidence || 0),
          0
        ) / activeSemanticMatches.length
      )
    : 0;

  return {
    action: unresolved.length === 0 ? 'repair_generated' : 'partial_repair',
    repaired_mapping: repairedMapping,
    original_mapping: originalMapping,
    mapping_rows: mappingRows,
    healed,
    unresolved,
    type_changes: typeChanges,
    summary: {
      total_mapping_entries: repairedMapping.length,
      healed_count: healed.length,
      unchanged_count: mappingRows.filter((row) => row.status === 'unchanged').length,
      unresolved_count: unresolved.length,
      type_change_count: typeChanges.length,
      semantic_match_count: activeSemanticMatches.length,
      average_confidence: averageConfidence,
    },
  };
}
