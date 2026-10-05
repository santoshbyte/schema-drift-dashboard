export function diffFields(baselineFields, currentFields) {
  const baselineMap = new Map(baselineFields.map((f) => [f.name, f]));
  const currentMap = new Map(currentFields.map((f) => [f.name, f]));

  const baselineNames = new Set(baselineMap.keys());
  const currentNames = new Set(currentMap.keys());

  const removedNames = [...baselineNames].filter((n) => !currentNames.has(n));
  const addedNames = [...currentNames].filter((n) => !baselineNames.has(n));
  const commonNames = [...baselineNames].filter((n) => currentNames.has(n));

  const changes = [];

  for (const name of commonNames) {
    const oldType = baselineMap.get(name).type;
    const newType = currentMap.get(name).type;
    if (oldType !== newType) {
      changes.push({ change_type: 'type_changed', field: name, old_type: oldType, new_type: newType });
    }
  }

  for (const name of removedNames) {
    changes.push({
      change_type: 'field_removed',
      field: name,
      old_type: baselineMap.get(name).type,
      possible_rename_candidates: addedNames,
    });
  }

  for (const name of addedNames) {
    changes.push({ change_type: 'field_added', field: name, new_type: currentMap.get(name).type });
  }

  return {
    baseline_field_count: baselineNames.size,
    current_field_count: currentNames.size,
    changes,
  };
}