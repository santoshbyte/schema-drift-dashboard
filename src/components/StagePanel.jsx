import { normalizeDetectedChange } from '../utils/pipelineHelpers';

function KeyValueRow({ label, value }) {
  if (value === null || value === undefined) return null;
  return (
    <div className="kv-row">
      <span className="kv-label">{label}</span>
      <span className="kv-value">{String(value)}</span>
    </div>
  );
}

function StagePanel({ stageIndex, entry }) {
  if (stageIndex === 0) {
    const changes = normalizeDetectedChange(entry.detected_change);
    return (
      <div className="stage-content">
        {changes.map((change, i) => (
          <div key={i} className="stage-block">
            <KeyValueRow label="change_type" value={change.change_type} />
            <KeyValueRow label="field" value={change.field} />
            {change.possible_rename_candidates && (
              <KeyValueRow
                label="candidates"
                value={change.possible_rename_candidates.join(', ')}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (stageIndex === 1) {
    const m = entry.semantic_match;
    return (
      <div className="stage-content">
        <KeyValueRow label="match_type" value={m.match_type} />
        <KeyValueRow label="matched_field" value={m.matched_field ?? 'none'} />
        <div className="kv-row">
          <span className="kv-label">confidence</span>
          <div className="confidence-bar-track">
            <div className="confidence-bar-fill" style={{ width: `${m.confidence}%` }} />
          </div>
          <span className="kv-value">{m.confidence}%</span>
        </div>
        <KeyValueRow label="reasoning" value={m.reasoning} />
      </div>
    );
  }

  if (stageIndex === 2) {
    const r = entry.proposed_repair;
    if (r.action === 'no_repair_generated') {
      return (
        <div className="stage-content">
          <KeyValueRow label="action" value={r.action} />
          <KeyValueRow label="reason" value={r.reason} />
        </div>
      );
    }
    return (
      <div className="stage-content">
        <KeyValueRow label="action" value={r.action} />
        <div className="kv-row">
          <span className="kv-label">mapping</span>
          <span className="kv-value">
            {r.before.source_field} to {r.before.target_field} becomes {r.after.source_field} to {r.after.target_field}
          </span>
        </div>
      </div>
    );
  }

  if (stageIndex === 3) {
    const v = entry.validation_result;
    return (
      <div className="stage-content">
        <KeyValueRow label="result" value={v.validation_result} />
        <KeyValueRow label="reason" value={v.reason} />
        {v.generated_target_payload && (
          <pre className="payload-block">{v.generated_target_payload}</pre>
        )}
      </div>
    );
  }

  if (stageIndex === 4) {
    const g = entry.gate_decision;
    return (
      <div className="stage-content">
        <KeyValueRow label="decision" value={g.decision} />
        <KeyValueRow label="reason" value={g.reason} />
      </div>
    );
  }

  if (stageIndex === 5) {
    const rb = entry.rollback_reference?.original_mapping;
    return (
      <div className="stage-content">
        {rb ? (
          <KeyValueRow label="rollback target" value={`${rb.source_field} -> ${rb.target_field}`} />
        ) : (
          <p className="stage-panel-placeholder">No rollback reference recorded (no repair was applied).</p>
        )}
      </div>
    );
  }

  return null;
}

export default StagePanel;