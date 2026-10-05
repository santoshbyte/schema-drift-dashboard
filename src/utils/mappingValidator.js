// export function validateRepair({
//   repairedMapping,
//   payloadXml
// }) {
//   if (!repairedMapping || !Array.isArray(repairedMapping)) {
//     return {
//       validation_result: 'fail',
//       reason: 'No repaired mapping was provided.'
//     };
//   }

//   if (!payloadXml) {
//     return {
//       validation_result: 'fail',
//       reason: 'No sample payload was provided.'
//     };
//   }

//   const parser = new DOMParser();
//   const doc = parser.parseFromString(
//     payloadXml,
//     'application/xml'
//   );

//   if (doc.querySelector('parsererror')) {
//     return {
//       validation_result: 'fail',
//       reason: 'Sample payload is not valid XML.'
//     };
//   }

//   const missingFields = [];

//   for (const mapping of repairedMapping) {
//     if (!mapping.source) continue;

//     const elements = Array.from(
//       doc.getElementsByTagName('*')
//     );

//     const exists = elements.some(
//       (element) =>
//         element.localName === mapping.source
//     );

//     if (!exists) {
//       missingFields.push(mapping.source);
//     }
//   }

//   if (missingFields.length > 0) {
//     return {
//       validation_result: 'fail',
//       reason:
//         `Repaired mapping references source fields not found in payload: ${missingFields.join(', ')}`
//     };
//   }

//   return {
//     validation_result: 'pass',
//     reason:
//       'All repaired source fields are present in the sample payload.'
//   };
// }

function parseXml(xml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  if (doc.querySelector('parsererror')) {
    throw new Error('Sample payload is not valid XML.');
  }
  return doc;
}

function getElementByLocalName(doc, name) {
  return Array.from(doc.getElementsByTagName('*')).find(
    (element) => element.localName === name
  );
}

function createTargetPayload(mapping, sourceDoc) {
  const serializer = new XMLSerializer();
  const targetDoc = document.implementation.createDocument('', 'ReconciledRecord', null);
  const root = targetDoc.documentElement;

  for (const item of mapping) {
    const sourceElement = getElementByLocalName(sourceDoc, item.source);
    if (!sourceElement) continue;

    const targetElement = targetDoc.createElement(item.target);
    targetElement.textContent = sourceElement.textContent ?? '';
    root.appendChild(targetElement);
  }

  return serializer.serializeToString(targetDoc);
}

export function validateRepair({
  repairedMapping,
  payloadXml,
  currentFields = [],
}) {
  if (!Array.isArray(repairedMapping) || repairedMapping.length === 0) {
    return {
      validation_result: 'fail',
      reason: 'No repaired mapping was provided.',
    };
  }

  if (!payloadXml) {
    return {
      validation_result: 'fail',
      reason: 'No sample payload was provided.',
    };
  }

  let doc;
  try {
    doc = parseXml(payloadXml);
  } catch (error) {
    return {
      validation_result: 'fail',
      reason: error.message,
    };
  }

  const schemaByName = new Map(
    currentFields.map((field) => [field.name, field])
  );

  const missingRequired = [];
  const unknownSchemaFields = [];
  const optionalMissing = [];

  for (const mapping of repairedMapping) {
    if (!mapping.source || !mapping.target) continue;

    if (currentFields.length > 0 && !schemaByName.has(mapping.source)) {
      unknownSchemaFields.push(mapping.source);
      continue;
    }

    const sourceElement = getElementByLocalName(doc, mapping.source);
    if (sourceElement) continue;

    const schemaField = schemaByName.get(mapping.source);
    if (schemaField && Number(schemaField.minOccurs) === 0) {
      optionalMissing.push(mapping.source);
      continue;
    }

    missingRequired.push(mapping.source);
  }

  if (unknownSchemaFields.length > 0) {
    return {
      validation_result: 'fail',
      reason: `Repaired mapping references fields not present in the current schema: ${unknownSchemaFields.join(', ')}`,
      missing_required_fields: missingRequired,
      unknown_schema_fields: unknownSchemaFields,
      optional_missing_fields: optionalMissing,
    };
  }

  if (missingRequired.length > 0) {
    return {
      validation_result: 'fail',
      reason: `Required source fields are missing from the sample payload: ${missingRequired.join(', ')}`,
      missing_required_fields: missingRequired,
      unknown_schema_fields: unknownSchemaFields,
      optional_missing_fields: optionalMissing,
    };
  }

  const generatedTargetPayload = createTargetPayload(
    repairedMapping,
    doc
  );

  return {
    validation_result: 'pass',
    reason:
      optionalMissing.length > 0
        ? `All required repaired mappings are valid. ${optionalMissing.length} optional source field(s) were absent from the sample payload.`
        : 'All repaired source mappings are valid against the current schema and sample payload.',
    mapped_field_count: repairedMapping.length,
    validated_field_count: repairedMapping.length - optionalMissing.length,
    optional_missing_fields: optionalMissing,
    generated_target_payload: generatedTargetPayload,
  };
}
