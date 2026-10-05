// import { normalizeDetectedChange, pillClass } from '../utils/pipelineHelpers';

// function formatTimestamp(ts) {
//   return new Date(ts).toLocaleString();
// }

// function AuditTrail({ entries }) {
//   return (
//     <div className="audit-trail">
//       <table className="audit-table">
//         <thead>
//           <tr>
//             <th>Timestamp</th>
//             <th>Source</th>
//             <th>Field</th>
//             <th>Match Type</th>
//             <th>Confidence</th>
//             <th>Decision</th>
//           </tr>
//         </thead>

//         <tbody>
//           {entries.map((entry) => {
//             const changes = normalizeDetectedChange(entry.detected_change);
//             const field = changes[0]?.field ?? '-';
//             const match = entry.semantic_match;
//             const decision = entry.gate_decision?.decision ?? '—';

//             return (
//               <tr key={entry.id}>
//                 <td className="audit-timestamp">
//                   {formatTimestamp(entry.timestamp)}
//                 </td>

//                 <td>{entry.source ?? 'Pipeline'}</td>

//                 <td>{field}</td>

//                 <td>{match?.match_type ?? '—'}</td>

//                 <td>
//                   {match?.confidence !== undefined &&
//                   match?.confidence !== null
//                     ? `${match.confidence}%`
//                     : '—'}
//                 </td>

//                 <td>
//                   {decision === '—' ? (
//                     <span className="audit-neutral-pill">
//                       DETECTED
//                     </span>
//                   ) : (
//                     <span
//                       className={`audit-decision-pill ${pillClass(decision)}`}
//                     >
//                       {decision.replace('_', ' ')}
//                     </span>
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default AuditTrail;

import {
  normalizeDetectedChange,
  normalizeSemanticMatches,
  pillClass,
} from '../utils/pipelineHelpers';

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString();
}

function AuditTrail({ entries = [] }) {
  return (
    <div className="audit-trail">
      <table className="audit-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Source</th>
            <th>Field / Batch</th>
            <th>Match</th>
            <th>Confidence</th>
            <th>Decision</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const changes = normalizeDetectedChange(entry.detected_change);
            const matches = normalizeSemanticMatches(entry.semantic_match);
            const decision = entry.gate_decision?.decision ?? '—';
            const fields = changes.map((item) => item.field).filter(Boolean);
            const averageConfidence = matches.length
              ? Math.round(
                  matches.reduce(
                    (sum, match) => sum + Number(match.confidence || 0),
                    0
                  ) / matches.length
                )
              : null;

            return (
              <tr key={entry.id}>
                <td className="audit-timestamp">
                  {formatTimestamp(entry.timestamp)}
                </td>
                <td>{entry.source ?? 'Pipeline'}</td>
                <td>{fields.length > 1 ? `${fields.length} detected changes` : fields[0] ?? '-'}</td>
                <td>{matches.length > 1 ? `${matches.length} classified` : matches[0]?.match_type ?? '—'}</td>
                <td>{averageConfidence !== null ? `${averageConfidence}%` : '—'}</td>
                <td>
                  {decision === '—' ? (
                    <span className="audit-neutral-pill">IN PROGRESS</span>
                  ) : (
                    <span className={`audit-decision-pill ${pillClass(decision)}`}>
                      {decision.replace('_', ' ')}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AuditTrail;
