import './schema-drift-showcase.css';
import { useState, useEffect } from 'react';
import { scenarios } from './data/scenarios';
import { auditLog } from './data/auditLog';
import StagePanel from './components/StagePanel';
import DecisionBadge from './components/DecisionBadge';
import AuditTrail from './components/AuditTrail';
import UploadPanel from './components/UploadPanel';
import './App.css';

const STAGES = [
  'Detect',
  'Understand',
  'Heal',
  'Validate',
  'Decide',
  'Audit'
];

const AUDIT_STORAGE_KEY = 'schema-drift-runtime-audit';

function loadInitialAudit() {
  try {
    const stored = localStorage.getItem(AUDIT_STORAGE_KEY);

    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Could not load audit history:', error);
  }

  return auditLog.map((entry, index) => ({
    ...entry,
    id: `history-${index}`,
    source: 'Historical'
  }));
}

function App() {
  const [mode, setMode] = useState('replay');
  const [activeScenarioId, setActiveScenarioId] = useState('B');
  const [activeStage, setActiveStage] = useState(0);
  const [showAudit, setShowAudit] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const [auditEntries, setAuditEntries] =
    useState(loadInitialAudit);

  const activeScenario = scenarios[activeScenarioId];
  const entry = activeScenario.entry;

  useEffect(() => {
    localStorage.setItem(
      AUDIT_STORAGE_KEY,
      JSON.stringify(auditEntries)
    );
  }, [auditEntries]);

function appendAuditEntry(baseEntry, source) {
  const runtimeEntry = {
    ...baseEntry,
    id: `run-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`,
    timestamp: new Date().toISOString(),
    source
  };

  setAuditEntries((previous) => [
    runtimeEntry,
    ...previous
  ]);

  return runtimeEntry.id;
}

function updateAuditEntry(id, updates) {
  setAuditEntries((previous) =>
    previous.map((entry) =>
      entry.id === id
        ? {
            ...entry,
            ...updates
          }
        : entry
    )
  );
}
  function selectScenario(id) {
    setActiveScenarioId(id);
    setActiveStage(0);
    setIsPlaying(false);
  }

  function runPipeline() {
    setActiveStage(0);
    setIsPlaying(true);

    appendAuditEntry(entry, 'Replay');
  }

function handleUploadActivity(activityEntry) {
  return appendAuditEntry(
    activityEntry,
    'Uploaded XSD'
  );
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
          <span className="app-title-main">
            Schema Drift Control
          </span>

          <span className="app-title-sub">
            SAP CPI - Autonomous Mapping Healer
          </span>
        </div>

        <div className="mode-toggle">
          <button
            className={`mode-btn ${
              mode === 'replay'
                ? 'mode-btn-active'
                : ''
            }`}
            onClick={() => setMode('replay')}
          >
            Replay demo
          </button>

          <button
            className={`mode-btn ${
              mode === 'upload'
                ? 'mode-btn-active'
                : ''
            }`}
            onClick={() => setMode('upload')}
          >
            Upload your own
          </button>
        </div>
      </header>

      {mode === 'replay' && (
        <>
          <div className="control-row">

            <p className="scenario-description">
              {activeScenario.description}
            </p>

            <div className="control-row-right">

              <div className="scenario-selector">
                {Object.values(scenarios).map((scenario) => (
                  <button
                    key={scenario.id}
                    className={`scenario-btn ${
                      scenario.id === activeScenarioId
                        ? 'scenario-btn-active'
                        : ''
                    }`}
                    onClick={() =>
                      selectScenario(scenario.id)
                    }
                  >
                    {scenario.id}
                  </button>
                ))}
              </div>

              <button
                className="run-btn"
                onClick={runPipeline}
                disabled={isPlaying}
              >
                {isPlaying
                  ? 'Running...'
                  : 'Run pipeline'}
              </button>
            </div>
          </div>

          <div className="pipeline-rail">
            {STAGES.map((stage, index) => (
              <div
                key={stage}
                className="pipeline-node-wrapper"
              >
                <button
                  className={`pipeline-node ${
                    index === activeStage
                      ? 'pipeline-node-active'
                      : ''
                  } ${
                    index < activeStage
                      ? 'pipeline-node-done'
                      : ''
                  }`}
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStage(index);
                  }}
                >
                  <span className="pipeline-node-index">
                    {index + 1}
                  </span>

                  <span className="pipeline-node-label">
                    {stage}
                  </span>
                </button>

                {index < STAGES.length - 1 && (
                  <div
                    className={`pipeline-connector ${
                      activeStage > index
                        ? 'pipeline-connector-filled'
                        : ''
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <DecisionBadge
            decision={entry.gate_decision.decision}
            reason={entry.gate_decision.reason}
          />

          <div className="stage-panel">
            <StagePanel
              key={activeStage}
              stageIndex={activeStage}
              entry={entry}
            />
          </div>
        </>
      )}

      {mode === 'upload' && (
        <UploadPanel
          onActivityRecorded={handleUploadActivity}
          onActivityUpdated={updateAuditEntry}
        />  
      )}

      <div className="audit-toggle-row">
        <button
          className="audit-toggle-btn"
          onClick={() => setShowAudit(!showAudit)}
        >
          {showAudit
            ? 'Hide activity trail'
            : `Show activity trail (${auditEntries.length} runs)`}
        </button>
      </div>

      {showAudit && (
        <AuditTrail entries={auditEntries} />
      )}

    </div>
  );
}

export default App;