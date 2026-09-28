import { auditLog } from '../data/auditLog';
import { normalizeDetectedChange, pillClass } from '../utils/pipelineHelpers';

function formatTimestamp(ts) {
  return new Date(ts).toLocaleString();
}

function AuditTrail() {
  return (
    <div className="audit-trail">
      <table className="audit-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Field</th>
            <th>Match Type</th>
            <th>Confidence</th>
            <th>Decision</th>
          </tr>
        </thead>
        <tbody>
          {auditLog.map((entry, i) => {
            const changes = normalizeDetectedChange(entry.detected_change);
            const field = changes[0]?.field ?? '-';
            const match = entry.semantic_match;
            const decision = entry.gate_decision.decision;
            return (
              <tr key={i}>
                <td className="audit-timestamp">{formatTimestamp(entry.timestamp)}</td>
                <td>{field}</td>
                <td>{match.match_type}</td>
                <td>{match.confidence}%</td>
                <td>
                  <span className={`audit-decision-pill ${pillClass(decision)}`}>
                    {decision.replace('_', ' ')}
                  </span>
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