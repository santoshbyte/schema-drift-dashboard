// // import { useState, useMemo } from 'react';
// // import { readFileAsText } from '../utils/fileReader';
// // import { parseXsdFields } from '../utils/xsdParser';
// // import { diffFields } from '../utils/schemaDiff';
// // import { classifyField } from '../utils/liveMatcher';
// // import { generateMappingRepair } from '../utils/mappingHealer';
// // import { validateRepair } from '../utils/mappingValidator';
// // import { evaluateDecision } from '../utils/confidenceGate';

// // function FieldList({ title, fields }) {
// //   return (
// //     <div className="upload-field-list">
// //       <h3 className="upload-field-list-title">{title}</h3>

// //       <ul className="upload-field-ul">
// //         {fields.map((field) => (
// //           <li key={field.name} className="upload-field-item">
// //             <span className="upload-field-name">
// //               {field.name}
// //             </span>

// //             <span className="upload-field-min">
// //               {field.type}, minOccurs: {field.minOccurs}
// //             </span>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }

// // function ChangeList({ diff }) {
// //   if (!diff || diff.changes.length === 0) {
// //     return (
// //       <p className="stage-panel-placeholder">
// //         No changes detected between baseline and current.
// //       </p>
// //     );
// //   }

// //   return (
// //     <div className="diff-results">
// //       <h3 className="upload-field-list-title">
// //         Detected changes
// //       </h3>

// //       <div className="diff-change-list">
// //         {diff.changes.map((change, index) => (
// //           <div
// //             key={`${change.change_type}-${change.field}-${index}`}
// //             className="diff-change-item"
// //           >
// //             <span
// //               className={`diff-change-tag diff-tag-${change.change_type}`}
// //             >
// //               {change.change_type.replace('_', ' ')}
// //             </span>

// //             <span className="diff-change-detail">
// //               {change.change_type === 'field_removed' && (
// //                 <>
// //                   <strong>{change.field}</strong> removed.

// //                   {change.possible_rename_candidates?.length > 0 && (
// //                     <>
// //                       {' '}
// //                       Possible rename candidates:{' '}
// //                       {change.possible_rename_candidates.join(', ')}
// //                     </>
// //                   )}
// //                 </>
// //               )}

// //               {change.change_type === 'field_added' && (
// //                 <>
// //                   <strong>{change.field}</strong> added (
// //                   {change.new_type})
// //                 </>
// //               )}

// //               {change.change_type === 'type_changed' && (
// //                 <>
// //                   <strong>{change.field}</strong> type changed from{' '}
// //                   {change.old_type} to {change.new_type}
// //                 </>
// //               )}
// //             </span>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // function SemanticResult({ result }) {
// //   if (!result) return null;

// //   return (
// //     <div className="semantic-result">
// //       <h3 className="upload-field-list-title">
// //         Gemini semantic analysis
// //       </h3>

// //       <div className="semantic-result-grid">
// //         <div>
// //           <span className="semantic-label">Match Type</span>
// //           <strong>{result.match_type ?? '—'}</strong>
// //         </div>

// //         <div>
// //           <span className="semantic-label">Matched Field</span>
// //           <strong>{result.matched_field ?? 'None'}</strong>
// //         </div>

// //         <div>
// //           <span className="semantic-label">Confidence</span>
// //           <strong>
// //             {result.confidence !== null &&
// //             result.confidence !== undefined
// //               ? `${result.confidence}%`
// //               : '—'}
// //           </strong>
// //         </div>
// //       </div>

// //       {result.reasoning && (
// //         <p className="semantic-reasoning">
// //           {result.reasoning}
// //         </p>
// //       )}
// //     </div>
// //   );
// // }

// // function MappingResult({ repair }) {
// //   if (!repair) return null;

// //   return (
// //     <div className="semantic-result">
// //       <h3 className="upload-field-list-title">
// //         Proposed mapping repair
// //       </h3>

// //       <div className="semantic-result-grid">
// //         <div>
// //           <span className="semantic-label">Action</span>
// //           <strong>{repair.action}</strong>
// //         </div>

// //         <div>
// //           <span className="semantic-label">Before</span>
// //           <strong>
// //             {repair.before
// //               ? `${repair.before.source_field} → ${repair.before.target_field}`
// //               : '—'}
// //           </strong>
// //         </div>

// //         <div>
// //           <span className="semantic-label">After</span>
// //           <strong>
// //             {repair.after
// //               ? `${repair.after.source_field} → ${repair.after.target_field}`
// //               : '—'}
// //           </strong>
// //         </div>
// //       </div>

// //       {repair.reason && (
// //         <p className="semantic-reasoning">
// //           {repair.reason}
// //         </p>
// //       )}

// //       {repair.repaired_mapping && (
// //         <pre className="payload-block">
// //           {JSON.stringify(
// //             {
// //               mappings: repair.repaired_mapping
// //             },
// //             null,
// //             2
// //           )}
// //         </pre>
// //       )}
// //     </div>
// //   );
// // }

// // function ValidationResult({ result }) {
// //   if (!result) return null;

// //   const isPass =
// //     result.validation_result === 'pass';

// //   return (
// //     <div className="semantic-result">
// //       <h3 className="upload-field-list-title">
// //         Mapping validation
// //       </h3>

// //       <div className="semantic-result-grid">
// //         <div>
// //           <span className="semantic-label">
// //             Validation Result
// //           </span>

// //           <strong>
// //             {result.validation_result?.toUpperCase() ?? '—'}
// //           </strong>
// //         </div>

// //         <div>
// //           <span className="semantic-label">
// //             Status
// //           </span>

// //           <strong>
// //             {isPass ? 'VALID' : 'BLOCKED'}
// //           </strong>
// //         </div>
// //       </div>

// //       {result.reason && (
// //         <p className="semantic-reasoning">
// //           {result.reason}
// //         </p>
// //       )}

// //       {result.generated_target_payload && (
// //         <pre className="payload-block">
// //           {result.generated_target_payload}
// //         </pre>
// //       )}
// //     </div>
// //   );
// // }

// // function DecisionResult({ decision }) {
// //   if (!decision) return null;

// //   return (
// //     <div className="semantic-result">
// //       <h3 className="upload-field-list-title">
// //         Release decision
// //       </h3>

// //       <div className="semantic-result-grid">
// //         <div>
// //           <span className="semantic-label">
// //             Decision
// //           </span>

// //           <strong>
// //             {decision.decision}
// //           </strong>
// //         </div>

// //         <div>
// //           <span className="semantic-label">
// //             Confidence
// //           </span>

// //           <strong>
// //             {decision.confidence !== undefined &&
// //             decision.confidence !== null
// //               ? `${decision.confidence}%`
// //               : '—'}
// //           </strong>
// //         </div>

// //         <div>
// //           <span className="semantic-label">
// //             Validation
// //           </span>

// //           <strong>
// //             {decision.validation_result ?? 'PASS'}
// //           </strong>
// //         </div>
// //       </div>

// //       {decision.reason && (
// //         <p className="semantic-reasoning">
// //           {decision.reason}
// //         </p>
// //       )}
// //     </div>
// //   );
// // }

// // function UploadPanel({
// //   onActivityRecorded,
// //   onActivityUpdated
// // }) {
// //   const [baselineFields, setBaselineFields] =
// //     useState(null);

// //   const [currentFields, setCurrentFields] =
// //     useState(null);

// //   const [mappingData, setMappingData] =
// //     useState(null);

// //   const [payloadXml, setPayloadXml] =
// //     useState(null);

// //   const [error, setError] =
// //     useState(null);

// //   const [mappingError, setMappingError] =
// //     useState(null);

// //   const [payloadError, setPayloadError] =
// //     useState(null);

// //   const [semanticError, setSemanticError] =
// //     useState(null);

// //   const [healError, setHealError] =
// //     useState(null);

// //   const [validationError, setValidationError] =
// //     useState(null);

// //   const [decisionError, setDecisionError] =
// //     useState(null);

// //   const [auditId, setAuditId] =
// //     useState(null);

// //   const [semanticMatch, setSemanticMatch] =
// //     useState(null);

// //   const [semanticLoading, setSemanticLoading] =
// //     useState(false);

// //   const [repair, setRepair] =
// //     useState(null);

// //   const [healLoading, setHealLoading] =
// //     useState(false);

// //   const [validationResult, setValidationResult] =
// //     useState(null);

// //   const [validationLoading, setValidationLoading] =
// //     useState(false);

// //   const [decision, setDecision] =
// //     useState(null);

// //   const diff = useMemo(() => {
// //     if (!baselineFields || !currentFields) {
// //       return null;
// //     }

// //     return diffFields(
// //       baselineFields,
// //       currentFields
// //     );
// //   }, [baselineFields, currentFields]);

// //   function resetRunState() {
// //     setError(null);
// //     setMappingError(null);
// //     setPayloadError(null);
// //     setSemanticError(null);
// //     setHealError(null);
// //     setValidationError(null);
// //     setDecisionError(null);

// //     setAuditId(null);
// //     setSemanticMatch(null);
// //     setRepair(null);
// //     setValidationResult(null);
// //     setDecision(null);
// //   }

// //   async function handleXsdFile(event, setter) {
// //     resetRunState();

// //     const file = event.target.files?.[0];

// //     if (!file) {
// //       setter(null);
// //       return;
// //     }

// //     try {
// //       const text = await readFileAsText(file);
// //       const fields = parseXsdFields(text);

// //       setter(fields);
// //     } catch (err) {
// //       setter(null);

// //       setError(
// //         err instanceof Error
// //           ? err.message
// //           : 'Could not process the selected XSD file.'
// //       );
// //     }
// //   }

// //   async function handleMappingFile(event) {
// //     setMappingError(null);
// //     setHealError(null);
// //     setRepair(null);
// //     setValidationResult(null);
// //     setValidationError(null);
// //     setDecision(null);

// //     const file = event.target.files?.[0];

// //     if (!file) {
// //       setMappingData(null);
// //       return;
// //     }

// //     try {
// //       const text = await readFileAsText(file);
// //       const parsed = JSON.parse(text);

// //       setMappingData(parsed);
// //     } catch (err) {
// //       setMappingData(null);

// //       setMappingError(
// //         err instanceof Error
// //           ? err.message
// //           : 'Invalid mapping JSON.'
// //       );
// //     }
// //   }

// //   async function handlePayloadFile(event) {
// //     setPayloadError(null);
// //     setValidationResult(null);
// //     setValidationError(null);
// //     setDecision(null);

// //     const file = event.target.files?.[0];

// //     if (!file) {
// //       setPayloadXml(null);
// //       return;
// //     }

// //     try {
// //       const text = await readFileAsText(file);

// //       if (!text.trim()) {
// //         throw new Error(
// //           'The selected payload file is empty.'
// //         );
// //       }

// //       setPayloadXml(text);
// //     } catch (err) {
// //       setPayloadXml(null);

// //       setPayloadError(
// //         err instanceof Error
// //           ? err.message
// //           : 'Could not read the sample payload.'
// //       );
// //     }
// //   }

// //   function getRemovedChange() {
// //     return diff?.changes?.find(
// //       (change) =>
// //         change.change_type === 'field_removed'
// //     );
// //   }

// //   function runDetection() {
// //     const removedChange =
// //       getRemovedChange();

// //     if (
// //       !removedChange ||
// //       !onActivityRecorded
// //     ) {
// //       return;
// //     }

// //     setSemanticMatch(null);
// //     setSemanticError(null);
// //     setRepair(null);
// //     setHealError(null);
// //     setValidationResult(null);
// //     setValidationError(null);
// //     setDecision(null);
// //     setDecisionError(null);

// //     const id = onActivityRecorded({
// //       detected_change: {
// //         change_type: 'field_removed',
// //         field: removedChange.field,
// //         old_type: removedChange.old_type,
// //         possible_rename_candidates:
// //           removedChange.possible_rename_candidates || []
// //       },

// //       semantic_match: {
// //         match_type: 'pending',
// //         matched_field: null,
// //         confidence: null,
// //         reasoning:
// //           'Awaiting semantic classification.'
// //       },

// //       proposed_repair: {
// //         action: 'pending'
// //       },

// //       validation_result: {
// //         validation_result: 'pending'
// //       },

// //       gate_decision: {
// //         decision: '—',
// //         reason:
// //           'Schema detection completed. Semantic analysis has not yet been executed.'
// //       }
// //     });

// //     setAuditId(id);
// //   }

// //   async function runSemanticAnalysis() {
// //     const removedChange =
// //       getRemovedChange();

// //     if (
// //       !removedChange ||
// //       !auditId ||
// //       !onActivityUpdated
// //     ) {
// //       return;
// //     }

// //     const candidateFields =
// //       removedChange.possible_rename_candidates || [];

// //     const candidateSet =
// //       new Set(candidateFields);

// //     const siblingFields =
// //       (currentFields || [])
// //         .map((field) => field.name)
// //         .filter(
// //           (name) => !candidateSet.has(name)
// //         );

// //     setSemanticLoading(true);
// //     setSemanticError(null);
// //     setRepair(null);
// //     setHealError(null);
// //     setValidationResult(null);
// //     setValidationError(null);
// //     setDecision(null);
// //     setDecisionError(null);

// //     try {
// //       const result =
// //         await classifyField({
// //           removedField:
// //             removedChange.field,
// //           candidateFields,
// //           siblingFields
// //         });

// //       setSemanticMatch(result);

// //       onActivityUpdated(auditId, {
// //         semantic_match: result,

// //         gate_decision: {
// //           decision: '—',
// //           reason:
// //             `Gemini classification completed: ${result.match_type} match.`
// //         }
// //       });
// //     } catch (err) {
// //       const message =
// //         err instanceof Error
// //           ? err.message
// //           : 'Semantic classification failed.';

// //       setSemanticError(message);

// //       onActivityUpdated(auditId, {
// //         semantic_match: {
// //           match_type: 'error',
// //           matched_field: null,
// //           confidence: null,
// //           reasoning: message
// //         },

// //         gate_decision: {
// //           decision: '—',
// //           reason:
// //             'Semantic classification failed.'
// //         }
// //       });
// //     } finally {
// //       setSemanticLoading(false);
// //     }
// //   }

// //   function runHeal() {
// //     const removedChange =
// //       getRemovedChange();

// //     if (
// //       !removedChange ||
// //       !semanticMatch ||
// //       !mappingData
// //     ) {
// //       return;
// //     }

// //     setHealLoading(true);
// //     setHealError(null);
// //     setValidationResult(null);
// //     setValidationError(null);
// //     setDecision(null);
// //     setDecisionError(null);

// //     try {
// //       const result =
// //         generateMappingRepair({
// //           mappingData,
// //           oldSourceField:
// //             removedChange.field,
// //           newSourceField:
// //             semanticMatch.matched_field,
// //           matchType:
// //             semanticMatch.match_type,
// //           confidence:
// //             semanticMatch.confidence
// //         });

// //       setRepair(result);

// //       if (auditId && onActivityUpdated) {
// //         onActivityUpdated(auditId, {
// //           proposed_repair: result
// //         });
// //       }
// //     } catch (err) {
// //       const message =
// //         err instanceof Error
// //           ? err.message
// //           : 'Mapping repair generation failed.';

// //       setHealError(message);

// //       if (auditId && onActivityUpdated) {
// //         onActivityUpdated(auditId, {
// //           proposed_repair: {
// //             action:
// //               'no_repair_generated',
// //             reason: message
// //           }
// //         });
// //       }
// //     } finally {
// //       setHealLoading(false);
// //     }
// //   }

// //   function runValidation() {
// //     if (
// //       !repair ||
// //       repair.action !==
// //         'repair_generated' ||
// //       !repair.repaired_mapping ||
// //       !payloadXml
// //     ) {
// //       return;
// //     }

// //     setValidationLoading(true);
// //     setValidationError(null);
// //     setDecision(null);
// //     setDecisionError(null);

// //     try {
// //       const result =
// //         validateRepair({
// //           repairedMapping:
// //             repair.repaired_mapping,
// //           payloadXml
// //         });

// //       setValidationResult(result);

// //       if (auditId && onActivityUpdated) {
// //         onActivityUpdated(auditId, {
// //           validation_result: result
// //         });
// //       }
// //     } catch (err) {
// //       const message =
// //         err instanceof Error
// //           ? err.message
// //           : 'Mapping validation failed.';

// //       const failedResult = {
// //         validation_result: 'fail',
// //         reason: message
// //       };

// //       setValidationResult(
// //         failedResult
// //       );

// //       setValidationError(message);

// //       if (auditId && onActivityUpdated) {
// //         onActivityUpdated(auditId, {
// //           validation_result:
// //             failedResult
// //         });
// //       }
// //     } finally {
// //       setValidationLoading(false);
// //     }
// //   }

// //   function runDecision() {
// //     if (
// //       !semanticMatch ||
// //       !validationResult ||
// //       !repair ||
// //       repair.action !==
// //         'repair_generated'
// //     ) {
// //       return;
// //     }

// //     setDecisionError(null);

// //     try {
// //       const result =
// //         evaluateDecision({
// //           semanticMatch,
// //           validationResult
// //         });

// //       const enrichedDecision = {
// //         ...result,
// //         confidence:
// //           semanticMatch.confidence,
// //         validation_result:
// //           validationResult.validation_result
// //       };

// //       setDecision(
// //         enrichedDecision
// //       );

// //       if (auditId && onActivityUpdated) {
// //         onActivityUpdated(auditId, {
// //           gate_decision:
// //             enrichedDecision
// //         });
// //       }
// //     } catch (err) {
// //       const message =
// //         err instanceof Error
// //           ? err.message
// //           : 'Release decision failed.';

// //       setDecisionError(message);

// //       if (auditId && onActivityUpdated) {
// //         onActivityUpdated(auditId, {
// //           gate_decision: {
// //             decision: 'REJECT',
// //             reason: message
// //           }
// //         });
// //       }
// //     }
// //   }

// //   const hasChanges =
// //     Boolean(
// //       diff &&
// //       diff.changes.length > 0
// //     );

// //   const hasRemovedField =
// //     Boolean(getRemovedChange());

// //   const canRunSemantic =
// //     Boolean(
// //       auditId &&
// //       hasRemovedField &&
// //       !semanticLoading
// //     );

// //   const canRunHeal =
// //     Boolean(
// //       auditId &&
// //       mappingData &&
// //       semanticMatch &&
// //       ['exact', 'strong'].includes(
// //         semanticMatch.match_type
// //       ) &&
// //       semanticMatch.matched_field &&
// //       !healLoading
// //     );

// //   const canRunValidation =
// //     Boolean(
// //       repair &&
// //       repair.action ===
// //         'repair_generated' &&
// //       repair.repaired_mapping &&
// //       payloadXml &&
// //       !validationLoading
// //     );

// //   const canRunDecision =
// //     Boolean(
// //       semanticMatch &&
// //       repair &&
// //       repair.action ===
// //         'repair_generated' &&
// //       validationResult &&
// //       !decision
// //     );

// //   return (
// //     <div className="upload-panel">

// //       <p className="upload-note">
// //         Upload the baseline XSD, current XSD, existing
// //         mapping, and a sample source XML payload.
// //         Schema parsing and diffing happen locally.
// //         Semantic analysis uses the local Gemini proxy.
// //       </p>

// //       <div className="upload-row">

// //         <label className="upload-label">
// //           Baseline XSD

// //           <input
// //             type="file"
// //             accept=".xsd,.xml"
// //             onChange={(event) =>
// //               handleXsdFile(
// //                 event,
// //                 setBaselineFields
// //               )
// //             }
// //           />
// //         </label>

// //         <label className="upload-label">
// //           Current XSD

// //           <input
// //             type="file"
// //             accept=".xsd,.xml"
// //             onChange={(event) =>
// //               handleXsdFile(
// //                 event,
// //                 setCurrentFields
// //               )
// //             }
// //           />
// //         </label>

// //         <label className="upload-label">
// //           Existing Mapping JSON

// //           <input
// //             type="file"
// //             accept=".json"
// //             onChange={handleMappingFile}
// //           />
// //         </label>

// //         <label className="upload-label">
// //           Sample Source XML

// //           <input
// //             type="file"
// //             accept=".xml"
// //             onChange={handlePayloadFile}
// //           />
// //         </label>

// //       </div>

// //       {error && (
// //         <p className="upload-error">
// //           XSD: {error}
// //         </p>
// //       )}

// //       {mappingError && (
// //         <p className="upload-error">
// //           Mapping: {mappingError}
// //         </p>
// //       )}

// //       {payloadError && (
// //         <p className="upload-error">
// //           Payload: {payloadError}
// //         </p>
// //       )}

// //       <div className="upload-results">

// //         {baselineFields && (
// //           <FieldList
// //             title="Baseline fields"
// //             fields={baselineFields}
// //           />
// //         )}

// //         {currentFields && (
// //           <FieldList
// //             title="Current fields"
// //             fields={currentFields}
// //           />
// //         )}

// //       </div>

// //       {diff && (
// //         <ChangeList diff={diff} />
// //       )}

// //       {mappingData && (
// //         <div className="semantic-result">
// //           <h3 className="upload-field-list-title">
// //             Existing mapping loaded
// //           </h3>

// //           <pre className="payload-block">
// //             {JSON.stringify(
// //               mappingData,
// //               null,
// //               2
// //             )}
// //           </pre>
// //         </div>
// //       )}

// //       {payloadXml && (
// //         <div className="semantic-result">
// //           <h3 className="upload-field-list-title">
// //             Sample payload loaded
// //           </h3>

// //           <pre className="payload-block">
// //             {payloadXml}
// //           </pre>
// //         </div>
// //       )}

// //       {hasChanges && (
// //         <div className="upload-action-row">

// //           <button
// //             className="run-btn"
// //             onClick={runDetection}
// //           >
// //             Run detection
// //           </button>

// //           <button
// //             className="run-btn"
// //             onClick={runSemanticAnalysis}
// //             disabled={!canRunSemantic}
// //           >
// //             {semanticLoading
// //               ? 'Analyzing...'
// //               : 'Run semantic analysis'}
// //           </button>

// //           <button
// //             className="run-btn"
// //             onClick={runHeal}
// //             disabled={!canRunHeal}
// //           >
// //             {healLoading
// //               ? 'Healing...'
// //               : 'Generate repair'}
// //           </button>

// //           <button
// //             className="run-btn"
// //             onClick={runValidation}
// //             disabled={!canRunValidation}
// //           >
// //             {validationLoading
// //               ? 'Validating...'
// //               : 'Validate repair'}
// //           </button>

// //           <button
// //             className="run-btn"
// //             onClick={runDecision}
// //             disabled={!canRunDecision}
// //           >
// //             Decide release
// //           </button>

// //         </div>
// //       )}

// //       {semanticError && (
// //         <p className="upload-error">
// //           Semantic analysis: {semanticError}
// //         </p>
// //       )}

// //       {healError && (
// //         <p className="upload-error">
// //           Healing: {healError}
// //         </p>
// //       )}

// //       {validationError && (
// //         <p className="upload-error">
// //           Validation: {validationError}
// //         </p>
// //       )}

// //       {decisionError && (
// //         <p className="upload-error">
// //           Decision: {decisionError}
// //         </p>
// //       )}

// //       <SemanticResult
// //         result={semanticMatch}
// //       />

// //       <MappingResult
// //         repair={repair}
// //       />

// //       <ValidationResult
// //         result={validationResult}
// //       />

// //       <DecisionResult
// //         decision={decision}
// //       />

// //     </div>
// //   );
// // }

// // export default UploadPanel;


// import { useMemo, useState } from 'react';
// import { readFileAsText } from '../utils/fileReader';
// import { parseXsdFields } from '../utils/xsdParser';
// import { diffFields } from '../utils/schemaDiff';
// import { classifyField } from '../utils/liveMatcher';
// import { generateMappingRepair } from '../utils/mappingHealer';
// import { validateRepair } from '../utils/mappingValidator';
// import { evaluateDecision } from '../utils/confidenceGate';

// const PIPELINE = [
//   { key: 'detect', label: 'DETECT', detail: 'Schema drift' },
//   { key: 'understand', label: 'UNDERSTAND', detail: 'Semantic match' },
//   { key: 'heal', label: 'HEAL', detail: 'Mapping repair' },
//   { key: 'validate', label: 'VALIDATE', detail: 'Regression check' },
//   { key: 'decide', label: 'DECIDE', detail: 'Release gate' },
//   { key: 'audit', label: 'AUDIT', detail: 'Runtime trace' },
// ];

// function delay(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// function FieldList({ title, fields }) {
//   return (
//     <div className="upload-field-list">
//       <h3 className="upload-field-list-title">{title}</h3>
//       <ul className="upload-field-ul">
//         {fields.map((field) => (
//           <li key={field.name} className="upload-field-item">
//             <span className="upload-field-name">{field.name}</span>
//             <span className="upload-field-min">
//               {field.type}, minOccurs: {field.minOccurs}
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// function PipelineProgress({ activeStage, busy }) {
//   return (
//     <div className="healing-orchestrator">
//       <div className="orchestrator-head">
//         <div>
//           <span className="orchestrator-kicker">AUTONOMOUS EXECUTION</span>
//           <h3 className="orchestrator-title">Schema repair control plane</h3>
//         </div>
//         <span className={`orchestrator-status ${busy ? 'is-running' : 'is-ready'}`}>
//           {busy ? 'RUNNING' : activeStage >= 5 ? 'COMPLETE' : 'READY'}
//         </span>
//       </div>

//       <div className="orchestrator-rail" aria-label="Autonomous healing progress">
//         {PIPELINE.map((stage, index) => {
//           const done = index < activeStage || activeStage >= 5;
//           const active = index === activeStage && activeStage < 5;

//           return (
//             <div className="orchestrator-node-wrap" key={stage.key}>
//               <div className={`orchestrator-node ${done ? 'is-done' : ''} ${active ? 'is-active' : ''}`}>
//                 <span className="orchestrator-node-index">{String(index + 1).padStart(2, '0')}</span>
//                 <span className="orchestrator-node-label">{stage.label}</span>
//                 <span className="orchestrator-node-detail">{stage.detail}</span>
//               </div>
//               {index < PIPELINE.length - 1 && (
//                 <div className={`orchestrator-connector ${done ? 'is-filled' : ''}`} />
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// function ChangeList({ changes }) {
//   if (!changes?.length) return null;

//   return (
//     <div className="diff-results">
//       <div className="section-heading-row">
//         <h3 className="upload-field-list-title">Detected schema drift</h3>
//         <span className="metric-chip">{changes.length} changes</span>
//       </div>

//       <div className="diff-change-list">
//         {changes.map((change, index) => (
//           <div className="diff-change-item diff-item-enter" style={{ '--row-index': index }} key={`${change.change_type}-${change.field}-${index}`}>
//             <span className={`diff-change-tag diff-tag-${change.change_type}`}>
//               {change.change_type.replace('_', ' ')}
//             </span>
//             <span className="diff-change-detail">
//               <strong>{change.field}</strong>{' '}
//               {change.change_type === 'field_removed' && 'removed'}
//               {change.change_type === 'field_added' && `added (${change.new_type})`}
//               {change.change_type === 'type_changed' && `type changed ${change.old_type} → ${change.new_type}`}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function SemanticMatrix({ matches, pendingFields }) {
//   if (!matches?.length && !pendingFields?.length) return null;

//   const rows = [
//     ...(matches || []).map((match) => ({ ...match, status: match.match_type === 'error' ? 'error' : 'classified' })),
//     ...(pendingFields || []).map((field) => ({
//       removed_field: field,
//       status: 'pending',
//       match_type: 'pending',
//       matched_field: null,
//       confidence: null,
//     })),
//   ];

//   return (
//     <div className="semantic-result">
//       <div className="section-heading-row">
//         <h3 className="upload-field-list-title">Semantic classification matrix</h3>
//         <span className="metric-chip metric-chip-accent">{rows.length} field(s)</span>
//       </div>

//       <div className="semantic-table-wrap">
//         <table className="semantic-table">
//           <thead>
//             <tr>
//               <th>Removed source</th>
//               <th>Replacement</th>
//               <th>Match</th>
//               <th>Confidence</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((row, index) => (
//               <tr key={`${row.removed_field}-${index}`} className="mapping-row-enter" style={{ '--row-index': index }}>
//                 <td className="mono-cell">{row.removed_field}</td>
//                 <td className="mono-cell">{row.matched_field ?? '—'}</td>
//                 <td>{row.match_type}</td>
//                 <td>
//                   {row.confidence !== null && row.confidence !== undefined ? (
//                     <span className="confidence-inline">
//                       <span className="confidence-track">
//                         <span className="confidence-fill" style={{ width: `${Number(row.confidence)}%` }} />
//                       </span>
//                       {row.confidence}%
//                     </span>
//                   ) : '—'}
//                 </td>
//                 <td>
//                   <span className={`status-dot status-${row.status}`}>{row.status}</span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function MappingMatrix({ repair }) {
//   if (!repair?.mapping_rows?.length) return null;

//   return (
//     <div className="mapping-matrix-panel semantic-result">
//       <div className="mapping-matrix-head">
//         <div>
//           <span className="orchestrator-kicker">HEAL RESULT</span>
//           <h3 className="upload-field-list-title">Entire mapping after autonomous repair</h3>
//         </div>
//         <div className="mapping-summary">
//           <span><strong>{repair.summary.healed_count}</strong> healed</span>
//           <span><strong>{repair.summary.unchanged_count}</strong> unchanged</span>
//           <span className={repair.summary.unresolved_count ? 'is-danger' : ''}><strong>{repair.summary.unresolved_count}</strong> unresolved</span>
//         </div>
//       </div>

//       <div className="mapping-table-wrap">
//         <table className="mapping-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Source field</th>
//               <th>Target field</th>
//               <th>State</th>
//               <th>Confidence</th>
//             </tr>
//           </thead>
//           <tbody>
//             {repair.mapping_rows.map((row, index) => (
//               <tr key={`${row.source}-${row.target}-${index}`} className={`mapping-row-enter mapping-state-${row.status}`} style={{ '--row-index': index }}>
//                 <td className="muted-cell">{String(index + 1).padStart(2, '0')}</td>
//                 <td className="mono-cell">
//                   {row.previous_source && (
//                     <span className="source-change-old">{row.previous_source} → </span>
//                   )}
//                   <span className={row.status === 'healed' ? 'source-change-new' : ''}>{row.source}</span>
//                 </td>
//                 <td className="mono-cell">{row.target}</td>
//                 <td>
//                   <span className={`mapping-status mapping-status-${row.status}`}>
//                     {row.status}
//                   </span>
//                 </td>
//                 <td>{row.confidence ? `${row.confidence}%` : row.status === 'unchanged' ? '—' : '—'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {repair.type_changes?.length > 0 && (
//         <div className="risk-strip">
//           <strong>Schema risk retained for review:</strong>{' '}
//           {repair.type_changes.map((item) => `${item.field} ${item.old_type} → ${item.new_type}`).join(' · ')}
//         </div>
//       )}
//     </div>
//   );
// }

// function ValidationCard({ result }) {
//   if (!result) return null;
//   const passed = result.validation_result === 'pass';

//   return (
//     <div className={`validation-card ${passed ? 'is-pass' : 'is-fail'}`}>
//       <div>
//         <span className="orchestrator-kicker">VALIDATION</span>
//         <h3>{passed ? 'Mapping validated' : 'Mapping blocked'}</h3>
//       </div>
//       <div className="validation-stat-grid">
//         <div><span>RESULT</span><strong>{result.validation_result?.toUpperCase()}</strong></div>
//         <div><span>FIELDS</span><strong>{result.validated_field_count ?? 0}</strong></div>
//         <div><span>OPTIONAL OMITTED</span><strong>{result.optional_missing_fields?.length ?? 0}</strong></div>
//       </div>
//       <p>{result.reason}</p>
//     </div>
//   );
// }

// function DecisionCard({ decision }) {
//   if (!decision) return null;
//   return (
//     <div className={`decision-card decision-card-${decision.decision}`}>
//       <div>
//         <span className="orchestrator-kicker">RELEASE GATE</span>
//         <h3>{decision.decision.replace('_', ' ')}</h3>
//       </div>
//       <p>{decision.reason}</p>
//     </div>
//   );
// }

// function UploadPanel({ onActivityRecorded, onActivityUpdated }) {
//   const [baselineFields, setBaselineFields] = useState(null);
//   const [currentFields, setCurrentFields] = useState(null);
//   const [mappingData, setMappingData] = useState(null);
//   const [payloadXml, setPayloadXml] = useState(null);

//   const [error, setError] = useState(null);
//   const [mappingError, setMappingError] = useState(null);
//   const [payloadError, setPayloadError] = useState(null);
//   const [runtimeError, setRuntimeError] = useState(null);

//   const [auditId, setAuditId] = useState(null);
//   const [semanticMatches, setSemanticMatches] = useState([]);
//   const [semanticLoading, setSemanticLoading] = useState(false);
//   const [repair, setRepair] = useState(null);
//   const [healLoading, setHealLoading] = useState(false);
//   const [validationResult, setValidationResult] = useState(null);
//   const [validationLoading, setValidationLoading] = useState(false);
//   const [decision, setDecision] = useState(null);
//   const [activeStage, setActiveStage] = useState(-1);
//   const [autoRunning, setAutoRunning] = useState(false);

//   const diff = useMemo(() => {
//     if (!baselineFields || !currentFields) return null;
//     return diffFields(baselineFields, currentFields);
//   }, [baselineFields, currentFields]);

//   const removedChanges = useMemo(
//     () => diff?.changes?.filter((change) => change.change_type === 'field_removed') ?? [],
//     [diff]
//   );

//   const addedFields = useMemo(
//     () => diff?.changes?.filter((change) => change.change_type === 'field_added').map((change) => change.field) ?? [],
//     [diff]
//   );

//   const hasReadyInputs = Boolean(diff && mappingData && payloadXml);
//   const pipelineComplete = activeStage >= 5;

//   function resetResults({ keepFiles = true } = {}) {
//     setRuntimeError(null);
//     setSemanticMatches([]);
//     setRepair(null);
//     setValidationResult(null);
//     setDecision(null);
//     setActiveStage(-1);
//     setAuditId(null);
//     if (!keepFiles) {
//       setBaselineFields(null);
//       setCurrentFields(null);
//       setMappingData(null);
//       setPayloadXml(null);
//     }
//   }

//   async function handleXsd(event, setter) {
//     const file = event.target.files?.[0];
//     resetResults();
//     setError(null);
//     if (!file) return setter(null);

//     try {
//       setter(parseXsdFields(await readFileAsText(file)));
//     } catch (err) {
//       setter(null);
//       setError(err instanceof Error ? err.message : 'Could not process XSD.');
//     }
//   }

//   async function handleMapping(event) {
//     const file = event.target.files?.[0];
//     setMappingError(null);
//     if (!file) return setMappingData(null);

//     try {
//       const parsed = JSON.parse(await readFileAsText(file));
//       if (!parsed || !parsed.mappings && typeof parsed !== 'object') {
//         throw new Error('Unsupported mapping JSON format.');
//       }
//       setMappingData(parsed);
//       resetResults();
//     } catch (err) {
//       setMappingData(null);
//       setMappingError(err instanceof Error ? err.message : 'Invalid mapping JSON.');
//     }
//   }

//   async function handlePayload(event) {
//     const file = event.target.files?.[0];
//     setPayloadError(null);
//     if (!file) return setPayloadXml(null);

//     try {
//       const text = await readFileAsText(file);
//       if (!text.trim()) throw new Error('Sample payload is empty.');
//       setPayloadXml(text);
//       resetResults();
//     } catch (err) {
//       setPayloadXml(null);
//       setPayloadError(err instanceof Error ? err.message : 'Could not read payload.');
//     }
//   }

//   function createAuditEntry() {
//     if (!onActivityRecorded || !diff) return null;

//     return onActivityRecorded({
//       source: 'Uploaded XSD',
//       detected_change: diff.changes,
//       semantic_match: [],
//       proposed_repair: { action: 'pending' },
//       validation_result: { validation_result: 'pending' },
//       gate_decision: {
//         decision: '—',
//         reason: 'Autonomous pipeline initialized.'
//       }
//     });
//   }

//   async function classifyAll(runId = auditId) {
//     const results = [];

//     for (let index = 0; index < removedChanges.length; index += 1) {
//       const change = removedChanges[index];
//       setActiveStage(1);

//       // Give every removed field the full candidate set. The healer later
//       // resolves collisions using confidence, rather than making the AI
//       // depend on the order of the schema fields.
//       const candidates = [...addedFields];
//       const candidateSet = new Set(candidates);
//       const siblingFields = (currentFields || [])
//         .map((field) => field.name)
//         .filter((name) => !candidateSet.has(name));

//       const baseMatch = {
//         removed_field: change.field,
//         match_type: 'error',
//         matched_field: null,
//         confidence: 0,
//         reasoning: 'Semantic classification did not complete.'
//       };

//       try {
//         const result = await classifyField({
//           removedField: change.field,
//           candidateFields: candidates,
//           siblingFields
//         });

//         const normalized = { ...result, removed_field: change.field };
//         results.push(normalized);

//       } catch (err) {
//         results.push({
//           ...baseMatch,
//           reasoning: err instanceof Error ? err.message : baseMatch.reasoning
//         });
//       }

//       setSemanticMatches([...results]);
//       if (runId && onActivityUpdated) {
//         onActivityUpdated(runId, { semantic_match: [...results] });
//       }

//       await delay(350);
//     }

//     return results;
//   }

//   function buildRepair(matches) {
//     return generateMappingRepair({
//       mappingData,
//       detectedChanges: diff?.changes ?? [],
//       semanticMatches: matches,
//     });
//   }

//   function buildValidation(repairResult) {
//     return validateRepair({
//       repairedMapping: repairResult.repaired_mapping,
//       payloadXml,
//       currentFields,
//     });
//   }

//   async function runAutonomousHealing() {
//     if (!hasReadyInputs || autoRunning) return;

//     if (!removedChanges.length) {
//       setRuntimeError('No removed source fields were detected. Add a rename/removal drift to demonstrate autonomous healing.');
//       return;
//     }

//     setAutoRunning(true);
//     setRuntimeError(null);
//     setSemanticLoading(true);
//     setHealLoading(false);
//     setValidationLoading(false);
//     setDecision(null);
//     setRepair(null);
//     setValidationResult(null);
//     setSemanticMatches([]);
//     setActiveStage(0);

//     try {
//       const id = createAuditEntry();
//       setAuditId(id);
//       await delay(500);

//       const matches = await classifyAll(id);
//       setSemanticLoading(false);

//       setActiveStage(2);
//       setHealLoading(true);
//       await delay(700);
//       const repairResult = buildRepair(matches);
//       setRepair(repairResult);
//       setHealLoading(false);
//       if (id && onActivityUpdated) onActivityUpdated(id, { proposed_repair: repairResult });

//       setActiveStage(3);
//       setValidationLoading(true);
//       await delay(700);
//       const validation = buildValidation(repairResult);
//       setValidationResult(validation);
//       setValidationLoading(false);
//       if (id && onActivityUpdated) onActivityUpdated(id, { validation_result: validation });

//       setActiveStage(4);
//       await delay(700);
//       const gate = evaluateDecision({
//         semanticMatches: matches,
//         validationResult: validation,
//         repair: repairResult,
//       });
//       setDecision(gate);
//       if (id && onActivityUpdated) onActivityUpdated(id, { gate_decision: gate });

//       setActiveStage(5);
//       await delay(600);
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Autonomous healing failed.';
//       setRuntimeError(message);
//     } finally {
//       setSemanticLoading(false);
//       setHealLoading(false);
//       setValidationLoading(false);
//       setAutoRunning(false);
//     }
//   }

//   return (
//     <div className="upload-panel">
//       <div className="showcase-banner">
//         <div>
//           <span className="orchestrator-kicker">LIVE POC · ENTERPRISE AI</span>
//           <h2>Autonomous Schema Drift &amp; Mapping Healer</h2>
//           <p>
//             Detect every drift, classify every removed field, repair the complete mapping, validate the resulting contract, and gate release without hardcoded business field names.
//           </p>
//         </div>
//         <div className="showcase-badge">GEMINI PROXY</div>
//       </div>

//       <PipelineProgress activeStage={activeStage} busy={autoRunning} />

//       <div className="upload-row upload-row-four">
//         <label className="upload-label">
//           <span>Baseline XSD</span>
//           <input type="file" accept=".xsd,.xml" onChange={(event) => handleXsd(event, setBaselineFields)} />
//         </label>
//         <label className="upload-label">
//           <span>Current XSD</span>
//           <input type="file" accept=".xsd,.xml" onChange={(event) => handleXsd(event, setCurrentFields)} />
//         </label>
//         <label className="upload-label">
//           <span>Existing Mapping JSON</span>
//           <input type="file" accept=".json" onChange={handleMapping} />
//         </label>
//         <label className="upload-label">
//           <span>Sample Source XML</span>
//           <input type="file" accept=".xml" onChange={handlePayload} />
//         </label>
//       </div>

//       {(error || mappingError || payloadError || runtimeError) && (
//         <div className="error-stack">
//           {error && <p className="upload-error">XSD: {error}</p>}
//           {mappingError && <p className="upload-error">Mapping: {mappingError}</p>}
//           {payloadError && <p className="upload-error">Payload: {payloadError}</p>}
//           {runtimeError && <p className="upload-error">Pipeline: {runtimeError}</p>}
//         </div>
//       )}

//       {(baselineFields || currentFields) && (
//         <div className="upload-results">
//           {baselineFields && <FieldList title="Baseline fields" fields={baselineFields} />}
//           {currentFields && <FieldList title="Current fields" fields={currentFields} />}
//         </div>
//       )}

//       <ChangeList changes={diff?.changes} />

//       <div className="autonomous-action-row">
//         <button className="run-btn run-btn-primary" onClick={runAutonomousHealing} disabled={!hasReadyInputs || autoRunning}>
//           {autoRunning ? 'Autonomous healing in progress…' : 'Run autonomous healing'}
//         </button>
//         <span className="run-context">
//           {diff ? `${diff.changes.length} schema changes · ${removedChanges.length} removed · ${mappingData?.mappings?.length ?? 'mapping'} entries` : 'Upload the four inputs to arm the control plane.'}
//         </span>
//       </div>

//       {semanticLoading && (
//         <div className="live-activity-strip">
//           <span className="pulse-dot" />
//           Gemini is classifying removed fields one by one…
//         </div>
//       )}

//       <SemanticMatrix matches={semanticMatches} pendingFields={removedChanges.slice(semanticMatches.length).map((change) => change.field)} />
//       <MappingMatrix repair={repair} />
//       <ValidationCard result={validationResult} />
//       <DecisionCard decision={decision} />

//       {validationResult?.generated_target_payload && (
//         <div className="semantic-result payload-result-card">
//           <div className="section-heading-row">
//             <h3 className="upload-field-list-title">Validated target payload</h3>
//             <span className="metric-chip metric-chip-success">TRANSFORMED</span>
//           </div>
//           <pre className="payload-block">{validationResult.generated_target_payload}</pre>
//         </div>
//       )}

//       {pipelineComplete && (
//         <div className="completion-ribbon">
//           <span className="completion-check">✓</span>
//           <div>
//             <strong>End-to-end autonomous run completed.</strong>
//             <span>DETECT → UNDERSTAND → HEAL → VALIDATE → DECIDE → AUDIT</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default UploadPanel;








// import { useMemo, useState } from 'react';
// import { readFileAsText } from '../utils/fileReader';
// import { parseXsdFields } from '../utils/xsdParser';
// import { diffFields } from '../utils/schemaDiff';
// import { classifyField } from '../utils/liveMatcher';
// import { generateMappingRepair } from '../utils/mappingHealer';
// import { validateRepair } from '../utils/mappingValidator';
// import { evaluateDecision } from '../utils/confidenceGate';

// const PIPELINE = [
//   { key: 'detect', label: 'DETECT', detail: 'Schema drift' },
//   { key: 'understand', label: 'UNDERSTAND', detail: 'Semantic match' },
//   { key: 'heal', label: 'HEAL', detail: 'Mapping repair' },
//   { key: 'validate', label: 'VALIDATE', detail: 'Regression check' },
//   { key: 'decide', label: 'DECIDE', detail: 'Release gate' },
//   { key: 'audit', label: 'AUDIT', detail: 'Runtime trace' },
// ];

// function delay(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// function FieldList({ title, fields }) {
//   return (
//     <div className="upload-field-list">
//       <h3 className="upload-field-list-title">{title}</h3>
//       <ul className="upload-field-ul">
//         {fields.map((field) => (
//           <li key={field.name} className="upload-field-item">
//             <span className="upload-field-name">{field.name}</span>
//             <span className="upload-field-min">
//               {field.type}, minOccurs: {field.minOccurs}
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// function PipelineProgress({ activeStage, busy }) {
//   return (
//     <div className="healing-orchestrator">
//       <div className="orchestrator-head">
//         <div>
//           <span className="orchestrator-kicker">AUTONOMOUS EXECUTION</span>
//           <h3 className="orchestrator-title">Schema repair control plane</h3>
//         </div>
//         <span className={`orchestrator-status ${busy ? 'is-running' : 'is-ready'}`}>
//           {busy ? 'RUNNING' : activeStage >= 5 ? 'COMPLETE' : 'READY'}
//         </span>
//       </div>

//       <div className="orchestrator-rail" aria-label="Autonomous healing progress">
//         {PIPELINE.map((stage, index) => {
//           const done = index < activeStage || activeStage >= 5;
//           const active = index === activeStage && activeStage < 5;

//           return (
//             <div className="orchestrator-node-wrap" key={stage.key}>
//               <div className={`orchestrator-node ${done ? 'is-done' : ''} ${active ? 'is-active' : ''}`}>
//                 <span className="orchestrator-node-index">{String(index + 1).padStart(2, '0')}</span>
//                 <span className="orchestrator-node-label">{stage.label}</span>
//                 <span className="orchestrator-node-detail">{stage.detail}</span>
//               </div>
//               {index < PIPELINE.length - 1 && (
//                 <div className={`orchestrator-connector ${done ? 'is-filled' : ''}`} />
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// function ChangeList({ changes }) {
//   if (!changes?.length) return null;

//   return (
//     <div className="diff-results">
//       <div className="section-heading-row">
//         <h3 className="upload-field-list-title">Detected schema drift</h3>
//         <span className="metric-chip">{changes.length} changes</span>
//       </div>

//       <div className="diff-change-list">
//         {changes.map((change, index) => (
//           <div className="diff-change-item diff-item-enter" style={{ '--row-index': index }} key={`${change.change_type}-${change.field}-${index}`}>
//             <span className={`diff-change-tag diff-tag-${change.change_type}`}>
//               {change.change_type.replace('_', ' ')}
//             </span>
//             <span className="diff-change-detail">
//               <strong>{change.field}</strong>{' '}
//               {change.change_type === 'field_removed' && 'removed'}
//               {change.change_type === 'field_added' && `added (${change.new_type})`}
//               {change.change_type === 'type_changed' && `type changed ${change.old_type} → ${change.new_type}`}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function SemanticMatrix({ matches, pendingFields }) {
//   if (!matches?.length && !pendingFields?.length) return null;

//   const rows = [
//     ...(matches || []).map((match) => ({ ...match, status: match.match_type === 'error' ? 'error' : 'classified' })),
//     ...(pendingFields || []).map((field) => ({
//       removed_field: field,
//       status: 'pending',
//       match_type: 'pending',
//       matched_field: null,
//       confidence: null,
//     })),
//   ];

//   return (
//     <div className="semantic-result">
//       <div className="section-heading-row">
//         <h3 className="upload-field-list-title">Semantic classification matrix</h3>
//         <span className="metric-chip metric-chip-accent">{rows.length} field(s)</span>
//       </div>

//       <div className="semantic-table-wrap">
//         <table className="semantic-table">
//           <thead>
//             <tr>
//               <th>Removed source</th>
//               <th>Replacement</th>
//               <th>Match</th>
//               <th>Confidence</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((row, index) => (
//               <tr key={`${row.removed_field}-${index}`} className="mapping-row-enter" style={{ '--row-index': index }}>
//                 <td className="mono-cell">{row.removed_field}</td>
//                 <td className="mono-cell">{row.matched_field ?? '—'}</td>
//                 <td>{row.match_type}</td>
//                 <td>
//                   {row.confidence !== null && row.confidence !== undefined ? (
//                     <span className="confidence-inline">
//                       <span className="confidence-track">
//                         <span className="confidence-fill" style={{ width: `${Number(row.confidence)}%` }} />
//                       </span>
//                       {row.confidence}%
//                     </span>
//                   ) : '—'}
//                 </td>
//                 <td>
//                   <span className={`status-dot status-${row.status}`}>{row.status}</span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function MappingMatrix({ repair }) {
//   if (!repair?.mapping_rows?.length) return null;

//   return (
//     <div className="mapping-matrix-panel semantic-result">
//       <div className="mapping-matrix-head">
//         <div>
//           <span className="orchestrator-kicker">HEAL RESULT</span>
//           <h3 className="upload-field-list-title">Entire mapping after autonomous repair</h3>
//         </div>
//         <div className="mapping-summary">
//           <span><strong>{repair.summary.healed_count}</strong> healed</span>
//           <span><strong>{repair.summary.unchanged_count}</strong> unchanged</span>
//           <span className={repair.summary.unresolved_count ? 'is-danger' : ''}><strong>{repair.summary.unresolved_count}</strong> unresolved</span>
//         </div>
//       </div>

//       <div className="mapping-table-wrap">
//         <table className="mapping-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Source field</th>
//               <th>Target field</th>
//               <th>State</th>
//               <th>Confidence</th>
//             </tr>
//           </thead>
//           <tbody>
//             {repair.mapping_rows.map((row, index) => (
//               <tr key={`${row.source}-${row.target}-${index}`} className={`mapping-row-enter mapping-state-${row.status}`} style={{ '--row-index': index }}>
//                 <td className="muted-cell">{String(index + 1).padStart(2, '0')}</td>
//                 <td className="mono-cell">
//                   {row.previous_source && (
//                     <span className="source-change-old">{row.previous_source} → </span>
//                   )}
//                   <span className={row.status === 'healed' ? 'source-change-new' : ''}>{row.source}</span>
//                 </td>
//                 <td className="mono-cell">{row.target}</td>
//                 <td>
//                   <span className={`mapping-status mapping-status-${row.status}`}>
//                     {row.status}
//                   </span>
//                 </td>
//                 <td>{row.confidence ? `${row.confidence}%` : row.status === 'unchanged' ? '—' : '—'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {repair.type_changes?.length > 0 && (
//         <div className="risk-strip">
//           <strong>Schema risk retained for review:</strong>{' '}
//           {repair.type_changes.map((item) => `${item.field} ${item.old_type} → ${item.new_type}`).join(' · ')}
//         </div>
//       )}
//     </div>
//   );
// }

// function ValidationCard({ result }) {
//   if (!result) return null;
//   const passed = result.validation_result === 'pass';

//   return (
//     <div className={`validation-card ${passed ? 'is-pass' : 'is-fail'}`}>
//       <div>
//         <span className="orchestrator-kicker">VALIDATION</span>
//         <h3>{passed ? 'Mapping validated' : 'Mapping blocked'}</h3>
//       </div>
//       <div className="validation-stat-grid">
//         <div><span>RESULT</span><strong>{result.validation_result?.toUpperCase()}</strong></div>
//         <div><span>FIELDS</span><strong>{result.validated_field_count ?? 0}</strong></div>
//         <div><span>OPTIONAL OMITTED</span><strong>{result.optional_missing_fields?.length ?? 0}</strong></div>
//       </div>
//       <p>{result.reason}</p>
//     </div>
//   );
// }

// function DecisionCard({ decision }) {
//   if (!decision) return null;
//   return (
//     <div className={`decision-card decision-card-${decision.decision}`}>
//       <div>
//         <span className="orchestrator-kicker">RELEASE GATE</span>
//         <h3>{decision.decision.replace('_', ' ')}</h3>
//       </div>
//       <p>{decision.reason}</p>
//     </div>
//   );
// }

// function UploadPanel({ onActivityRecorded, onActivityUpdated }) {
//   const [baselineFields, setBaselineFields] = useState(null);
//   const [currentFields, setCurrentFields] = useState(null);
//   const [mappingData, setMappingData] = useState(null);
//   const [payloadXml, setPayloadXml] = useState(null);

//   const [error, setError] = useState(null);
//   const [mappingError, setMappingError] = useState(null);
//   const [payloadError, setPayloadError] = useState(null);
//   const [runtimeError, setRuntimeError] = useState(null);

//   const [auditId, setAuditId] = useState(null);
//   const [semanticMatches, setSemanticMatches] = useState([]);
//   const [semanticLoading, setSemanticLoading] = useState(false);
//   const [repair, setRepair] = useState(null);
//   const [healLoading, setHealLoading] = useState(false);
//   const [validationResult, setValidationResult] = useState(null);
//   const [validationLoading, setValidationLoading] = useState(false);
//   const [decision, setDecision] = useState(null);
//   const [activeStage, setActiveStage] = useState(-1);
//   const [autoRunning, setAutoRunning] = useState(false);

//   const diff = useMemo(() => {
//     if (!baselineFields || !currentFields) return null;
//     return diffFields(baselineFields, currentFields);
//   }, [baselineFields, currentFields]);

//   const removedChanges = useMemo(
//     () => diff?.changes?.filter((change) => change.change_type === 'field_removed') ?? [],
//     [diff]
//   );

//   const addedFields = useMemo(
//     () => diff?.changes?.filter((change) => change.change_type === 'field_added').map((change) => change.field) ?? [],
//     [diff]
//   );

//   const hasReadyInputs = Boolean(diff && mappingData && payloadXml);
//   const pipelineComplete = activeStage >= 5;

//   function resetResults({ keepFiles = true } = {}) {
//     setRuntimeError(null);
//     setSemanticMatches([]);
//     setRepair(null);
//     setValidationResult(null);
//     setDecision(null);
//     setActiveStage(-1);
//     setAuditId(null);
//     if (!keepFiles) {
//       setBaselineFields(null);
//       setCurrentFields(null);
//       setMappingData(null);
//       setPayloadXml(null);
//     }
//   }

//   async function handleXsd(event, setter) {
//     const file = event.target.files?.[0];
//     resetResults();
//     setError(null);
//     if (!file) return setter(null);

//     try {
//       setter(parseXsdFields(await readFileAsText(file)));
//     } catch (err) {
//       setter(null);
//       setError(err instanceof Error ? err.message : 'Could not process XSD.');
//     }
//   }

//   async function handleMapping(event) {
//     const file = event.target.files?.[0];
//     setMappingError(null);
//     if (!file) return setMappingData(null);

//     try {
//       const parsed = JSON.parse(await readFileAsText(file));
//       if (!parsed || !parsed.mappings && typeof parsed !== 'object') {
//         throw new Error('Unsupported mapping JSON format.');
//       }
//       setMappingData(parsed);
//       resetResults();
//     } catch (err) {
//       setMappingData(null);
//       setMappingError(err instanceof Error ? err.message : 'Invalid mapping JSON.');
//     }
//   }

//   async function handlePayload(event) {
//     const file = event.target.files?.[0];
//     setPayloadError(null);
//     if (!file) return setPayloadXml(null);

//     try {
//       const text = await readFileAsText(file);
//       if (!text.trim()) throw new Error('Sample payload is empty.');
//       setPayloadXml(text);
//       resetResults();
//     } catch (err) {
//       setPayloadXml(null);
//       setPayloadError(err instanceof Error ? err.message : 'Could not read payload.');
//     }
//   }

//   function createAuditEntry() {
//     if (!onActivityRecorded || !diff) return null;

//     return onActivityRecorded({
//       source: 'Uploaded XSD',
//       detected_change: diff.changes,
//       semantic_match: [],
//       proposed_repair: { action: 'pending' },
//       validation_result: { validation_result: 'pending' },
//       gate_decision: {
//         decision: '—',
//         reason: 'Autonomous pipeline initialized.'
//       }
//     });
//   }

//   async function classifyAll() {
//     const results = [];
//     const consumed = new Set();

//     for (let index = 0; index < removedChanges.length; index += 1) {
//       const change = removedChanges[index];
//       setActiveStage(1);

//       const candidates = addedFields.filter((field) => !consumed.has(field));
//       const candidateSet = new Set(candidates);
//       const siblingFields = (currentFields || [])
//         .map((field) => field.name)
//         .filter((name) => !candidateSet.has(name));

//       const baseMatch = {
//         removed_field: change.field,
//         match_type: 'error',
//         matched_field: null,
//         confidence: 0,
//         reasoning: 'Semantic classification did not complete.'
//       };

//       try {
//         const result = await classifyField({
//           removedField: change.field,
//           candidateFields: candidates,
//           siblingFields
//         });

//         const normalized = { ...result, removed_field: change.field };
//         results.push(normalized);

//         if (normalized.matched_field) consumed.add(normalized.matched_field);
//       } catch (err) {
//         results.push({
//           ...baseMatch,
//           reasoning: err instanceof Error ? err.message : baseMatch.reasoning
//         });
//       }

//       setSemanticMatches([...results]);
//       if (auditId && onActivityUpdated) {
//         onActivityUpdated(auditId, { semantic_match: [...results] });
//       }

//       await delay(350);
//     }

//     return results;
//   }

//   function buildRepair(matches) {
//     return generateMappingRepair({
//       mappingData,
//       detectedChanges: diff?.changes ?? [],
//       semanticMatches: matches,
//     });
//   }

//   function buildValidation(repairResult) {
//     return validateRepair({
//       repairedMapping: repairResult.repaired_mapping,
//       payloadXml,
//       currentFields,
//     });
//   }

//   async function runAutonomousHealing() {
//     if (!hasReadyInputs || autoRunning) return;

//     if (!removedChanges.length) {
//       setRuntimeError('No removed source fields were detected. Add a rename/removal drift to demonstrate autonomous healing.');
//       return;
//     }

//     setAutoRunning(true);
//     setRuntimeError(null);
//     setSemanticLoading(true);
//     setHealLoading(false);
//     setValidationLoading(false);
//     setDecision(null);
//     setRepair(null);
//     setValidationResult(null);
//     setSemanticMatches([]);
//     setActiveStage(0);

//     try {
//       const id = createAuditEntry();
//       setAuditId(id);
//       await delay(500);

//       const matches = await classifyAll();
//       setSemanticLoading(false);

//       setActiveStage(2);
//       setHealLoading(true);
//       await delay(700);
//       const repairResult = buildRepair(matches);
//       setRepair(repairResult);
//       setHealLoading(false);
//       if (id && onActivityUpdated) onActivityUpdated(id, { proposed_repair: repairResult });

//       setActiveStage(3);
//       setValidationLoading(true);
//       await delay(700);
//       const validation = buildValidation(repairResult);
//       setValidationResult(validation);
//       setValidationLoading(false);
//       if (id && onActivityUpdated) onActivityUpdated(id, { validation_result: validation });

//       setActiveStage(4);
//       await delay(700);
//       const gate = evaluateDecision({
//         semanticMatches: matches,
//         validationResult: validation,
//         repair: repairResult,
//       });
//       setDecision(gate);
//       if (id && onActivityUpdated) onActivityUpdated(id, { gate_decision: gate });

//       setActiveStage(5);
//       await delay(600);
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Autonomous healing failed.';
//       setRuntimeError(message);
//     } finally {
//       setSemanticLoading(false);
//       setHealLoading(false);
//       setValidationLoading(false);
//       setAutoRunning(false);
//     }
//   }

//   return (
//     <div className="upload-panel">
//       <div className="showcase-banner">
//         <div>
//           <span className="orchestrator-kicker">LIVE POC · ENTERPRISE AI</span>
//           <h2>Autonomous Schema Drift &amp; Mapping Healer</h2>
//           <p>
//             Detect every drift, classify every removed field, repair the complete mapping, validate the resulting contract, and gate release without hardcoded business field names.
//           </p>
//         </div>
//         <div className="showcase-badge">GEMINI PROXY</div>
//       </div>

//       <PipelineProgress activeStage={activeStage} busy={autoRunning} />

//       <div className="upload-row upload-row-four">
//         <label className="upload-label">
//           <span>Baseline XSD</span>
//           <input type="file" accept=".xsd,.xml" onChange={(event) => handleXsd(event, setBaselineFields)} />
//         </label>
//         <label className="upload-label">
//           <span>Current XSD</span>
//           <input type="file" accept=".xsd,.xml" onChange={(event) => handleXsd(event, setCurrentFields)} />
//         </label>
//         <label className="upload-label">
//           <span>Existing Mapping JSON</span>
//           <input type="file" accept=".json" onChange={handleMapping} />
//         </label>
//         <label className="upload-label">
//           <span>Sample Source XML</span>
//           <input type="file" accept=".xml" onChange={handlePayload} />
//         </label>
//       </div>

//       {(error || mappingError || payloadError || runtimeError) && (
//         <div className="error-stack">
//           {error && <p className="upload-error">XSD: {error}</p>}
//           {mappingError && <p className="upload-error">Mapping: {mappingError}</p>}
//           {payloadError && <p className="upload-error">Payload: {payloadError}</p>}
//           {runtimeError && <p className="upload-error">Pipeline: {runtimeError}</p>}
//         </div>
//       )}

//       {(baselineFields || currentFields) && (
//         <div className="upload-results">
//           {baselineFields && <FieldList title="Baseline fields" fields={baselineFields} />}
//           {currentFields && <FieldList title="Current fields" fields={currentFields} />}
//         </div>
//       )}

//       <ChangeList changes={diff?.changes} />

//       <div className="autonomous-action-row">
//         <button className="run-btn run-btn-primary" onClick={runAutonomousHealing} disabled={!hasReadyInputs || autoRunning}>
//           {autoRunning ? 'Autonomous healing in progress…' : 'Run autonomous healing'}
//         </button>
//         <span className="run-context">
//           {diff ? `${diff.changes.length} schema changes · ${removedChanges.length} removed · ${mappingData?.mappings?.length ?? 'mapping'} entries` : 'Upload the four inputs to arm the control plane.'}
//         </span>
//       </div>

//       {semanticLoading && (
//         <div className="live-activity-strip">
//           <span className="pulse-dot" />
//           Gemini is classifying removed fields one by one…
//         </div>
//       )}

//       <SemanticMatrix matches={semanticMatches} pendingFields={removedChanges.slice(semanticMatches.length).map((change) => change.field)} />
//       <MappingMatrix repair={repair} />
//       <ValidationCard result={validationResult} />
//       <DecisionCard decision={decision} />

//       {validationResult?.generated_target_payload && (
//         <div className="semantic-result payload-result-card">
//           <div className="section-heading-row">
//             <h3 className="upload-field-list-title">Validated target payload</h3>
//             <span className="metric-chip metric-chip-success">TRANSFORMED</span>
//           </div>
//           <pre className="payload-block">{validationResult.generated_target_payload}</pre>
//         </div>
//       )}

//       {pipelineComplete && (
//         <div className="completion-ribbon">
//           <span className="completion-check">✓</span>
//           <div>
//             <strong>End-to-end autonomous run completed.</strong>
//             <span>DETECT → UNDERSTAND → HEAL → VALIDATE → DECIDE → AUDIT</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default UploadPanel;



import { useMemo, useState } from 'react';
import { readFileAsText } from '../utils/fileReader';
import { parseXsdFields } from '../utils/xsdParser';
import { diffFields } from '../utils/schemaDiff';
import { classifyField } from '../utils/liveMatcher';
import { generateMappingRepair } from '../utils/mappingHealer';
import { validateRepair } from '../utils/mappingValidator';
import { evaluateDecision } from '../utils/confidenceGate';

const PIPELINE = [
  { key: 'detect', number: '01', label: 'DETECT', detail: 'Find schema drift' },
  { key: 'understand', number: '02', label: 'UNDERSTAND', detail: 'AI semantic match' },
  { key: 'heal', number: '03', label: 'HEAL', detail: 'Repair full mapping' },
  { key: 'validate', number: '04', label: 'VALIDATE', detail: 'Regression check' },
  { key: 'decide', number: '05', label: 'DECIDE', detail: 'Release governance' },
  { key: 'audit', number: '06', label: 'AUDIT', detail: 'Persist execution' },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function PipelineRail({ activeStage, busy }) {
  const complete = activeStage >= 5;

  return (
    <section className="sd-card sd-pipeline-card">
      <div className="sd-section-topline">
        <div>
          <span className="sd-eyebrow">CONTROL PLANE</span>
          <h2 className="sd-section-title">Autonomous execution</h2>
          <p className="sd-section-subtitle">A visible DETECT → UNDERSTAND → HEAL → VALIDATE → DECIDE workflow.</p>
        </div>
        <span className={`sd-run-state ${busy ? 'running' : complete ? 'complete' : 'ready'}`}>
          <span className="sd-status-dot" />
          {busy ? 'LIVE RUN' : complete ? 'RUN COMPLETE' : 'READY'}
        </span>
      </div>

      <div className="sd-pipeline-rail">
        {PIPELINE.map((stage, index) => {
          const isDone = complete || index < activeStage;
          const isActive = !complete && index === activeStage;
          const isQueued = index > activeStage;

          return (
            <div className="sd-stage-wrap" key={stage.key}>
              <div className={`sd-stage-node ${isDone ? 'done' : ''} ${isActive ? 'active' : ''} ${isQueued ? 'queued' : ''}`}>
                <div className="sd-stage-number">{isDone ? '✓' : stage.number}</div>
                <div className="sd-stage-copy">
                  <strong>{stage.label}</strong>
                  <span>{stage.detail}</span>
                </div>
              </div>
              {index < PIPELINE.length - 1 && (
                <div className={`sd-stage-line ${isDone ? 'filled' : ''}`} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FileCard({ index, eyebrow, title, description, fileName, accept, onChange, disabled }) {
  return (
    <label className={`sd-file-card ${fileName ? 'has-file' : ''} ${disabled ? 'is-disabled' : ''}`}>
      <input type="file" accept={accept} onChange={onChange} disabled={disabled} />
      <div className="sd-file-card-top">
        <span className="sd-file-number">{String(index).padStart(2, '0')}</span>
        <span className="sd-file-state">{fileName ? 'LOADED' : 'WAITING'}</span>
      </div>
      <div className="sd-file-icon" aria-hidden="true">{fileName ? '✓' : '+'}</div>
      <div className="sd-file-copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <div className="sd-file-name" title={fileName || ''}>
        {fileName || 'Choose a file'}
      </div>
      <div className="sd-file-action">Browse file</div>
    </label>
  );
}

function StatStrip({ diff, repair, mappingData }) {
  const changes = diff?.changes?.length ?? 0;
  const removed = diff?.changes?.filter((item) => item.change_type === 'field_removed').length ?? 0;
  const mappingCount = repair?.summary?.total_mapping_entries ?? mappingData?.mappings?.length ?? 0;
  const healed = repair?.summary?.healed_count ?? 0;

  const stats = [
    { label: 'Schema changes', value: changes, hint: changes ? 'detected' : 'waiting' },
    { label: 'Drift candidates', value: removed, hint: removed ? 'AI analysis' : 'waiting' },
    { label: 'Mappings', value: mappingCount, hint: mappingCount ? 'loaded' : 'waiting' },
    { label: 'Healed', value: healed, hint: healed ? 'autonomously repaired' : 'pending' },
  ];

  return (
    <div className="sd-stat-strip">
      {stats.map((stat, index) => (
        <div className={`sd-stat-card stat-${index}`} key={stat.label}>
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
          <small>{stat.hint}</small>
        </div>
      ))}
    </div>
  );
}

function SchemaCompare({ baselineFields, currentFields, diff }) {
  if (!baselineFields && !currentFields) return null;

  const baselineCount = baselineFields?.length ?? 0;
  const currentCount = currentFields?.length ?? 0;
  const changes = diff?.changes?.length ?? 0;

  return (
    <section className="sd-card sd-compare-card sd-reveal">
      <div className="sd-section-topline compact">
        <div>
          <span className="sd-eyebrow">DETECT</span>
          <h3 className="sd-section-title small">Schema contract comparison</h3>
        </div>
        <span className="sd-count-badge">{changes} changes</span>
      </div>

      <div className="sd-compare-grid">
        <div className="sd-schema-side baseline">
          <span className="sd-mini-label">BASELINE</span>
          <strong>{baselineCount} fields</strong>
          <div className="sd-schema-meter"><span style={{ width: `${Math.min(baselineCount * 4, 100)}%` }} /></div>
        </div>
        <div className="sd-compare-arrow" aria-hidden="true">→</div>
        <div className="sd-schema-side current">
          <span className="sd-mini-label">CURRENT</span>
          <strong>{currentCount} fields</strong>
          <div className="sd-schema-meter current"><span style={{ width: `${Math.min(currentCount * 4, 100)}%` }} /></div>
        </div>
      </div>
    </section>
  );
}

function DriftPanel({ changes }) {
  if (!changes?.length) return null;

  const typeLabel = (type) => {
    if (type === 'field_removed') return 'REMOVED';
    if (type === 'field_added') return 'ADDED';
    return 'TYPE CHANGE';
  };

  return (
    <section className="sd-card sd-drift-card sd-reveal">
      <div className="sd-section-topline compact">
        <div>
          <span className="sd-eyebrow danger-eyebrow">DRIFT DETECTED</span>
          <h3 className="sd-section-title small">Changes requiring intelligence</h3>
        </div>
        <span className="sd-count-badge danger">{changes.length} events</span>
      </div>

      <div className="sd-drift-list">
        {changes.map((change, index) => (
          <div className="sd-drift-row" style={{ '--row-index': index }} key={`${change.change_type}-${change.field}-${index}`}>
            <div className={`sd-drift-type ${change.change_type}`}>{typeLabel(change.change_type)}</div>
            <div className="sd-drift-field">
              <code>{change.field}</code>
              {change.change_type === 'type_changed' && (
                <span>{change.old_type} <b>→</b> {change.new_type}</span>
              )}
              {change.change_type === 'field_added' && <span>new source contract field</span>}
              {change.change_type === 'field_removed' && <span>requires semantic replacement</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SemanticPanel({ matches, pendingFields }) {
  if (!matches?.length && !pendingFields?.length) return null;

  const rows = [
    ...(matches || []).map((match) => ({ ...match, state: match.match_type === 'error' ? 'ERROR' : 'MATCHED' })),
    ...(pendingFields || []).map((field) => ({
      removed_field: field,
      match_type: 'pending',
      matched_field: null,
      confidence: null,
      state: 'WAITING',
    })),
  ];

  return (
    <section className="sd-card sd-semantic-card sd-reveal">
      <div className="sd-section-topline compact">
        <div>
          <span className="sd-eyebrow">UNDERSTAND · GEMINI</span>
          <h3 className="sd-section-title small">Semantic replacement matrix</h3>
        </div>
        <span className="sd-count-badge accent">{rows.length} classifications</span>
      </div>

      <div className="sd-semantic-table-wrap">
        <table className="sd-table sd-semantic-table">
          <thead>
            <tr>
              <th>Removed</th>
              <th>Suggested replacement</th>
              <th>Match quality</th>
              <th>Confidence</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const confidence = Number(row.confidence || 0);
              return (
                <tr key={`${row.removed_field}-${index}`} style={{ '--row-index': index }} className="sd-table-row-reveal">
                  <td><code className="sd-code-red">{row.removed_field}</code></td>
                  <td>
                    {row.matched_field ? (
                      <span className="sd-match-arrow"><code className="sd-code-green">{row.matched_field}</code><b>✓</b></span>
                    ) : <span className="sd-dim">Waiting…</span>}
                  </td>
                  <td><span className={`sd-pill ${row.match_type}`}>{row.match_type}</span></td>
                  <td>
                    {row.confidence !== null && row.confidence !== undefined ? (
                      <div className="sd-confidence">
                        <div className="sd-confidence-track"><span style={{ width: `${Math.min(confidence, 100)}%` }} /></div>
                        <strong>{confidence}%</strong>
                      </div>
                    ) : <span className="sd-dim">—</span>}
                  </td>
                  <td><span className={`sd-state ${String(row.state).toLowerCase()}`}>{row.state}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MappingRepairPanel({ repair }) {
  if (!repair?.mapping_rows?.length) return null;

  const { summary } = repair;

  return (
    <section className="sd-card sd-heal-card sd-reveal">
      <div className="sd-heal-header">
        <div>
          <span className="sd-eyebrow success-eyebrow">HEAL · AUTONOMOUS REPAIR</span>
          <h3 className="sd-section-title">Entire mapping healed</h3>
          <p className="sd-section-subtitle">Only source fields changed; target contracts and unaffected mappings are preserved.</p>
        </div>
        <div className="sd-heal-total">
          <strong>{summary.healed_count}</strong>
          <span>repairs</span>
        </div>
      </div>

      <div className="sd-heal-summary">
        <div><span>Mapping entries</span><strong>{summary.total_mapping_entries}</strong></div>
        <div className="green"><span>Healed</span><strong>{summary.healed_count}</strong></div>
        <div><span>Unchanged</span><strong>{summary.unchanged_count}</strong></div>
        <div className={summary.unresolved_count ? 'red' : ''}><span>Unresolved</span><strong>{summary.unresolved_count}</strong></div>
      </div>

      <div className="sd-table-wrap">
        <table className="sd-table sd-mapping-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Existing source</th>
              <th>Target contract</th>
              <th>Repair action</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {repair.mapping_rows.map((row, index) => (
              <tr key={`${row.source}-${row.target}-${index}`} className={`sd-map-row ${row.status}`} style={{ '--row-index': index }}>
                <td className="sd-index">{String(index + 1).padStart(2, '0')}</td>
                <td>
                  {row.status === 'healed' ? (
                    <div className="sd-heal-transition">
                      <code className="sd-old-source">{row.previous_source}</code>
                      <span className="sd-arrow-pulse">→</span>
                      <code className="sd-new-source">{row.source}</code>
                    </div>
                  ) : (
                    <code>{row.source}</code>
                  )}
                </td>
                <td><code>{row.target}</code></td>
                <td>
                  <span className={`sd-map-badge ${row.status}`}>
                    {row.status === 'healed' ? 'AI REPAIRED' : row.status === 'unchanged' ? 'PRESERVED' : 'UNRESOLVED'}
                  </span>
                </td>
                <td>{row.confidence ? <strong className="sd-confidence-number">{row.confidence}%</strong> : <span className="sd-dim">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {repair.type_changes?.length > 0 && (
        <div className="sd-risk-banner">
          <div className="sd-risk-icon">!</div>
          <div><strong>Schema risk retained for governance review</strong><span>{repair.type_changes.map((item) => `${item.field}: ${item.old_type} → ${item.new_type}`).join(' · ')}</span></div>
        </div>
      )}
    </section>
  );
}

function ValidationDecision({ validationResult, decision }) {
  if (!validationResult && !decision) return null;
  const passed = validationResult?.validation_result === 'pass';
  const decisionClass = decision?.decision || 'PENDING';

  return (
    <div className="sd-governance-grid sd-reveal">
      {validationResult && (
        <section className={`sd-card sd-governance-card ${passed ? 'pass' : 'fail'}`}>
          <div className="sd-governance-icon">{passed ? '✓' : '×'}</div>
          <div className="sd-governance-content">
            <span className="sd-eyebrow">VALIDATE</span>
            <h3>{passed ? 'Regression check passed' : 'Validation blocked release'}</h3>
            <p>{validationResult.reason}</p>
            <div className="sd-governance-stats">
              <span><b>{validationResult.validated_field_count ?? 0}</b> validated</span>
              <span><b>{validationResult.optional_missing_fields?.length ?? 0}</b> optional omitted</span>
            </div>
          </div>
        </section>
      )}

      {decision && (
        <section className={`sd-card sd-governance-card decision-${decisionClass}`}>
          <div className="sd-governance-icon">{decisionClass === 'AUTO_RELEASE' ? '✓' : decisionClass === 'NEEDS_APPROVAL' ? '!' : '×'}</div>
          <div className="sd-governance-content">
            <span className="sd-eyebrow">DECIDE</span>
            <h3>{decisionClass.replace('_', ' ')}</h3>
            <p>{decision.reason}</p>
            <div className="sd-governance-stats">
              <span><b>{decisionClass}</b> release state</span>
              <span><b>Policy</b> enforced</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function UploadPanel({ onActivityRecorded, onActivityUpdated }) {
  const [baselineFields, setBaselineFields] = useState(null);
  const [currentFields, setCurrentFields] = useState(null);
  const [mappingData, setMappingData] = useState(null);
  const [payloadXml, setPayloadXml] = useState(null);
  const [baselineFileName, setBaselineFileName] = useState('');
  const [currentFileName, setCurrentFileName] = useState('');
  const [mappingFileName, setMappingFileName] = useState('');
  const [payloadFileName, setPayloadFileName] = useState('');

  const [error, setError] = useState(null);
  const [mappingError, setMappingError] = useState(null);
  const [payloadError, setPayloadError] = useState(null);
  const [runtimeError, setRuntimeError] = useState(null);
  const [auditId, setAuditId] = useState(null);
  const [semanticMatches, setSemanticMatches] = useState([]);
  const [semanticLoading, setSemanticLoading] = useState(false);
  const [repair, setRepair] = useState(null);
  const [healLoading, setHealLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validationLoading, setValidationLoading] = useState(false);
  const [decision, setDecision] = useState(null);
  const [activeStage, setActiveStage] = useState(-1);
  const [autoRunning, setAutoRunning] = useState(false);

  const diff = useMemo(() => {
    if (!baselineFields || !currentFields) return null;
    return diffFields(baselineFields, currentFields);
  }, [baselineFields, currentFields]);

  const removedChanges = useMemo(
    () => diff?.changes?.filter((change) => change.change_type === 'field_removed') ?? [],
    [diff]
  );

  const addedFields = useMemo(
    () => diff?.changes?.filter((change) => change.change_type === 'field_added').map((change) => change.field) ?? [],
    [diff]
  );

  const hasReadyInputs = Boolean(diff && mappingData && payloadXml);
  const pipelineComplete = activeStage >= 5;

  function resetResults({ keepFiles = true } = {}) {
    setRuntimeError(null);
    setSemanticMatches([]);
    setRepair(null);
    setValidationResult(null);
    setDecision(null);
    setActiveStage(-1);
    setAuditId(null);
    if (!keepFiles) {
      setBaselineFields(null);
      setCurrentFields(null);
      setMappingData(null);
      setPayloadXml(null);
      setBaselineFileName('');
      setCurrentFileName('');
      setMappingFileName('');
      setPayloadFileName('');
    }
  }

  async function handleXsd(event, setter, setFileName) {
    const file = event.target.files?.[0];
    resetResults();
    setError(null);
    if (!file) return setter(null);
    try {
      setter(parseXsdFields(await readFileAsText(file)));
      setFileName(file.name);
    } catch (err) {
      setter(null);
      setFileName('');
      setError(err instanceof Error ? err.message : 'Could not process XSD.');
    }
  }

  async function handleMapping(event) {
    const file = event.target.files?.[0];
    setMappingError(null);
    if (!file) return setMappingData(null);
    try {
      const parsed = JSON.parse(await readFileAsText(file));
      if (!parsed || (typeof parsed !== 'object') || Array.isArray(parsed)) {
        throw new Error('Unsupported mapping JSON format.');
      }
      setMappingData(parsed);
      setMappingFileName(file.name);
      resetResults();
    } catch (err) {
      setMappingData(null);
      setMappingFileName('');
      setMappingError(err instanceof Error ? err.message : 'Invalid mapping JSON.');
    }
  }

  async function handlePayload(event) {
    const file = event.target.files?.[0];
    setPayloadError(null);
    if (!file) return setPayloadXml(null);
    try {
      const text = await readFileAsText(file);
      if (!text.trim()) throw new Error('Sample payload is empty.');
      setPayloadXml(text);
      setPayloadFileName(file.name);
      resetResults();
    } catch (err) {
      setPayloadXml(null);
      setPayloadFileName('');
      setPayloadError(err instanceof Error ? err.message : 'Could not read payload.');
    }
  }

  function createAuditEntry() {
    if (!onActivityRecorded || !diff) return null;
    return onActivityRecorded({
      source: 'Uploaded XSD',
      detected_change: diff.changes,
      semantic_match: [],
      proposed_repair: { action: 'pending' },
      validation_result: { validation_result: 'pending' },
      gate_decision: { decision: '—', reason: 'Autonomous pipeline initialized.' },
    });
  }

  async function classifyAll(runId = auditId) {
    const results = [];
    for (let index = 0; index < removedChanges.length; index += 1) {
      const change = removedChanges[index];
      setActiveStage(1);
      const candidates = [...addedFields];
      const candidateSet = new Set(candidates);
      const siblingFields = (currentFields || []).map((field) => field.name).filter((name) => !candidateSet.has(name));

      try {
        const result = await classifyField({
          removedField: change.field,
          candidateFields: candidates,
          siblingFields,
        });
        const normalized = { ...result, removed_field: change.field };
        results.push(normalized);
      } catch (err) {
        results.push({
          removed_field: change.field,
          match_type: 'error',
          matched_field: null,
          confidence: 0,
          reasoning: err instanceof Error ? err.message : 'Semantic classification failed.',
        });
      }
      setSemanticMatches([...results]);
      if (runId && onActivityUpdated) onActivityUpdated(runId, { semantic_match: [...results] });
      await delay(300);
    }
    return results;
  }

  function buildRepair(matches) {
    return generateMappingRepair({
      mappingData,
      detectedChanges: diff?.changes ?? [],
      semanticMatches: matches,
    });
  }

  function buildValidation(repairResult) {
    return validateRepair({
      repairedMapping: repairResult.repaired_mapping,
      payloadXml,
      currentFields,
    });
  }

  async function runAutonomousHealing() {
    if (!hasReadyInputs || autoRunning) return;
    if (!removedChanges.length) {
      setRuntimeError('No removed source fields were detected. Upload a rename/removal drift to demonstrate autonomous healing.');
      return;
    }

    setAutoRunning(true);
    setRuntimeError(null);
    setSemanticLoading(true);
    setHealLoading(false);
    setValidationLoading(false);
    setDecision(null);
    setRepair(null);
    setValidationResult(null);
    setSemanticMatches([]);
    setActiveStage(0);

    try {
      const id = createAuditEntry();
      setAuditId(id);
      await delay(450);

      const matches = await classifyAll(id);
      setSemanticLoading(false);

      setActiveStage(2);
      setHealLoading(true);
      await delay(750);
      const repairResult = buildRepair(matches);
      setRepair(repairResult);
      setHealLoading(false);
      if (id && onActivityUpdated) onActivityUpdated(id, { proposed_repair: repairResult });

      setActiveStage(3);
      setValidationLoading(true);
      await delay(700);
      const validation = buildValidation(repairResult);
      setValidationResult(validation);
      setValidationLoading(false);
      if (id && onActivityUpdated) onActivityUpdated(id, { validation_result: validation });

      setActiveStage(4);
      await delay(700);
      const gate = evaluateDecision({
        semanticMatches: matches,
        validationResult: validation,
        repair: repairResult,
      });
      setDecision(gate);
      if (id && onActivityUpdated) onActivityUpdated(id, { gate_decision: gate });

      setActiveStage(5);
      await delay(550);
    } catch (err) {
      setRuntimeError(err instanceof Error ? err.message : 'Autonomous healing failed.');
    } finally {
      setSemanticLoading(false);
      setHealLoading(false);
      setValidationLoading(false);
      setAutoRunning(false);
    }
  }

  const progressLabel = semanticLoading
    ? 'Gemini is interpreting field semantics…'
    : healLoading
      ? 'Rewriting the complete mapping graph…'
      : validationLoading
        ? 'Executing regression validation against the current payload…'
        : autoRunning
          ? 'Applying release governance…'
          : pipelineComplete
            ? 'Run completed — evidence captured below.'
            : 'Upload four artifacts to arm the autonomous control plane.';

  return (
    <div className="sd-shell">
      <header className="sd-hero sd-reveal">
        <div className="sd-hero-copy">
          <div className="sd-brand-row">
            <div className="sd-brand-mark">SD</div>
            <span>Schema Drift Control Plane</span>
            <span className="sd-live-badge"><i /> Gemini-enabled</span>
          </div>
          <h1>Autonomous Schema Drift<br /><span>&amp; Mapping Healer</span></h1>
          <p>
            An SAP Cloud Integration / GenAI control plane that detects schema drift, understands semantic replacements, heals the complete mapping, validates the repair, and enforces release governance.
          </p>
        </div>
        <div className="sd-hero-orb" aria-hidden="true">
          <div className="sd-orb-ring ring-one" />
          <div className="sd-orb-ring ring-two" />
          <div className="sd-orb-core">AI</div>
        </div>
      </header>

      <StatStrip diff={diff} repair={repair} mappingData={mappingData} />
      <PipelineRail activeStage={activeStage} busy={autoRunning} />

      <section className="sd-card sd-input-card sd-reveal">
        <div className="sd-section-topline">
          <div>
            <span className="sd-eyebrow">INPUT WORKSPACE</span>
            <h2 className="sd-section-title">Load the integration contract</h2>
            <p className="sd-section-subtitle">Everything required to prove autonomous healing — no business fields are hardcoded.</p>
          </div>
          <span className={`sd-input-ready ${hasReadyInputs ? 'armed' : ''}`}>
            <span className="sd-status-dot" /> {hasReadyInputs ? 'CONTROL PLANE ARMED' : '4 ARTIFACTS REQUIRED'}
          </span>
        </div>

        <div className="sd-file-grid">
          <FileCard index={1} title="Baseline XSD" description="Original source contract" fileName={baselineFileName} accept=".xsd,.xml" onChange={(event) => handleXsd(event, setBaselineFields, setBaselineFileName)} disabled={autoRunning} />
          <FileCard index={2} title="Current XSD" description="Post-change source contract" fileName={currentFileName} accept=".xsd,.xml" onChange={(event) => handleXsd(event, setCurrentFields, setCurrentFileName)} disabled={autoRunning} />
          <FileCard index={3} title="Existing Mapping" description="Current source → target mapping" fileName={mappingFileName} accept=".json" onChange={handleMapping} disabled={autoRunning} />
          <FileCard index={4} title="Sample Payload" description="Current source runtime payload" fileName={payloadFileName} accept=".xml" onChange={handlePayload} disabled={autoRunning} />
        </div>

        {(error || mappingError || payloadError || runtimeError) && (
          <div className="sd-error-banner">
            <div className="sd-risk-icon">!</div>
            <div>
              {error && <span><b>XSD:</b> {error}</span>}
              {mappingError && <span><b>Mapping:</b> {mappingError}</span>}
              {payloadError && <span><b>Payload:</b> {payloadError}</span>}
              {runtimeError && <span><b>Pipeline:</b> {runtimeError}</span>}
            </div>
          </div>
        )}

        <div className="sd-command-bar">
          <div>
            <span className="sd-eyebrow">EXECUTION COMMAND</span>
            <strong>{progressLabel}</strong>
          </div>
          <button className={`sd-run-button ${autoRunning ? 'running' : ''}`} onClick={runAutonomousHealing} disabled={!hasReadyInputs || autoRunning}>
            <span className="sd-button-glow" />
            <span>{autoRunning ? 'AUTONOMOUS RUNNING…' : 'RUN AUTONOMOUS HEALING'}</span>
            <b>→</b>
          </button>
        </div>
      </section>

      <SchemaCompare baselineFields={baselineFields} currentFields={currentFields} diff={diff} />
      <DriftPanel changes={diff?.changes} />

      {semanticLoading && (
        <div className="sd-live-strip"><span className="sd-spinner" /> Gemini is classifying removed fields in sequence.</div>
      )}
      {healLoading && (
        <div className="sd-live-strip healing"><span className="sd-spinner" /> Rewriting the complete mapping while preserving unaffected rows.</div>
      )}
      {validationLoading && (
        <div className="sd-live-strip validate"><span className="sd-spinner" /> Validating the repaired mapping against the current schema and payload.</div>
      )}

      <SemanticPanel matches={semanticMatches} pendingFields={removedChanges.slice(semanticMatches.length).map((change) => change.field)} />
      <MappingRepairPanel repair={repair} />
      <ValidationDecision validationResult={validationResult} decision={decision} />

      {validationResult?.generated_target_payload && (
        <section className="sd-card sd-payload-card sd-reveal">
          <div className="sd-section-topline compact">
            <div>
              <span className="sd-eyebrow">VALIDATED OUTPUT</span>
              <h3 className="sd-section-title small">Generated target payload</h3>
            </div>
            <span className="sd-count-badge green">TRANSFORMED</span>
          </div>
          <pre>{validationResult.generated_target_payload}</pre>
        </section>
      )}

      {pipelineComplete && (
        <section className="sd-complete-banner sd-reveal">
          <div className="sd-complete-icon">✓</div>
          <div>
            <span className="sd-eyebrow success-eyebrow">AUDIT COMPLETE</span>
            <h3>Autonomous run finished successfully.</h3>
            <p>The execution produced a machine-readable evidence trail from detection through release governance.</p>
          </div>
          <div className="sd-complete-flow">DETECT <b>→</b> UNDERSTAND <b>→</b> HEAL <b>→</b> VALIDATE <b>→</b> DECIDE <b>→</b> AUDIT</div>
        </section>
      )}
    </div>
  );
}

export default UploadPanel;
