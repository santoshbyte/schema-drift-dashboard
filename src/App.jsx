import { useState, useEffect } from 'react';
import { scenarios } from './data/scenarios';
import StagePanel from './components/StagePanel';
import DecisionBadge from './components/DecisionBadge';
import AuditTrail from './components/AuditTrail';
import './App.css';

const STAGES = ['Detect', 'Understand', 'Heal', 'Validate', 'Decide', 'Audit'];

function App() {
  const [activeScenarioId, setActiveScenarioId] = useState('B');
  const [activeStage, setActiveStage] = useState(0);
  const [showAudit, setShowAudit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeScenario = scenarios[activeScenarioId];
  const entry = activeScenario.entry;

  function selectScenario(id) {
    setActiveScenarioId(id);
    setActiveStage(0);
    setIsPlaying(false);
  }

  function runPipeline() {
    setActiveStage(0);
    setIsPlaying(true);
  }

  useEffect(() => {
    if (!isPlaying) return;
    if (activeStage >= STAGES.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setActiveStage((s) => s + 1);
    }, 900);
    return () => clearTimeout(timer);
  }, [isPlaying, activeStage]);

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <span className="app-title-main">Schema Drift Control</span>
          <span className="app-title-sub">SAP CPI - Autonomous Mapping Healer</span>
        </div>
        <div className="scenario-selector">
          {Object.values(scenarios).map((s) => (
            <button
              key={s.id}
              className={`scenario-btn ${s.id === activeScenarioId ? 'scenario-btn-active' : ''}`}
              onClick={() => selectScenario(s.id)}
            >
              {s.id}
            </button>
          ))}
        </div>
      </header>

      <div className="control-row">
        <p className="scenario-description">{activeScenario.description}</p>
        <button className="run-btn" onClick={runPipeline} disabled={isPlaying}>
          {isPlaying ? 'Running...' : 'Run pipeline'}
        </button>
      </div>

      <div className="pipeline-rail">
        {STAGES.map((stage, index) => (
          <div key={stage} className="pipeline-node-wrapper">
            <button
              className={`pipeline-node ${index === activeStage ? 'pipeline-node-active' : ''} ${index < activeStage ? 'pipeline-node-done' : ''}`}
              onClick={() => { setIsPlaying(false); setActiveStage(index); }}
            >
              <span className="pipeline-node-index">{index + 1}</span>
              <span className="pipeline-node-label">{stage}</span>
            </button>
            {index < STAGES.length - 1 && (
              <div className={`pipeline-connector ${activeStage > index ? 'pipeline-connector-filled' : ''}`} />
            )}
          </div>
        ))}
      </div>

      <DecisionBadge decision={entry.gate_decision.decision} reason={entry.gate_decision.reason} />

      <div className="stage-panel">
        <StagePanel key={activeStage} stageIndex={activeStage} entry={entry} />
      </div>

      <div className="audit-toggle-row">
        <button className="audit-toggle-btn" onClick={() => setShowAudit(!showAudit)}>
          {showAudit ? 'Hide audit trail' : `Show audit trail (${9} runs)`}
        </button>
      </div>

      {showAudit && <AuditTrail />}
    </div>
  );
}

export default App;