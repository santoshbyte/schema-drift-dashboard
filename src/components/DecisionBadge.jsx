import { decisionClass } from '../utils/pipelineHelpers';

function DecisionBadge({ decision, reason }) {
  return (
    <div className={`decision-badge ${decisionClass(decision)}`}>
      <span className="decision-badge-label">{decision.replace('_', ' ')}</span>
      <span className="decision-badge-reason">{reason}</span>
    </div>
  );
}

export default DecisionBadge;