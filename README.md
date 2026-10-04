# Autonomous Schema Drift Control Plane

React/Vite control plane for the **Autonomous Schema Drift Detection & Semantic Mapping Healer** project.

The dashboard provides a visual interface for detecting schema changes, understanding semantic field relationships, observing mapping repairs, validating proposed changes, applying release governance, and auditing the complete execution flow.

---

## Project

Enterprise integration mappings can become invalid when upstream schemas change.

A field may be:

- Renamed
- Removed
- Added
- Changed in datatype
- Structurally modified

Instead of manually identifying and repairing every affected mapping, this project explores an AI-assisted workflow:

**DETECT → UNDERSTAND → HEAL → VALIDATE → DECIDE → AUDIT**

---

## Control Plane

The dashboard provides visibility into the autonomous healing process.

### DETECT

Compares the baseline schema against the current schema and identifies drift.

### UNDERSTAND

Uses semantic analysis to determine whether a removed field corresponds to a candidate field in the new schema.

### HEAL

Repairs the affected source-side mapping while preserving the existing target mapping.

### VALIDATE

Checks whether the repaired mapping is compatible with the current source payload.

### DECIDE

Applies confidence and validation rules to determine:

- `AUTO_RELEASE`
- `NEEDS_APPROVAL`
- `REJECT`

### AUDIT

Records runtime execution details including:

- Timestamp
- Source
- Detected field
- Semantic match
- Confidence
- Decision

---

## Features

### Replay Demo

Provides deterministic scenarios for demonstrating the pipeline.

### Upload Your Own

Accepts:

1. Baseline XSD
2. Current XSD
3. Existing Mapping JSON
4. Sample Source XML

The uploaded artifacts are processed through the autonomous workflow.

### Semantic Analysis

Displays:

- Candidate field
- Match type
- Confidence
- AI reasoning

### Mapping Visualization

Shows the mapping before and after repair and distinguishes:

- AI repaired mappings
- Preserved mappings
- Unresolved mappings

### Release Governance

The UI separates AI confidence from release authorization.

A high-confidence AI result does not automatically bypass validation.


## Backend Engine

The AI and schema-processing engine is maintained separately:

**[schema-drift-backend](https://github.com/santoshbyte/schema-drift-backend)**

The backend contains the schema-drift detection, Gemini semantic matching, mapping-healing, validation, confidence-gate and proxy components.
---

## Architecture

```text
                    React Control Plane
                           │
                           │ HTTP
                           ▼
                 Gemini / Backend Engine
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
         Schema Diff   Semantic AI   Mapping
                         Matching     Healing
              │            │            │
              └────────────┼────────────┘
                           ▼
                       Validation
                           │
                           ▼
                    Confidence Gate
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        AUTO_RELEASE  NEEDS_APPROVAL   REJECT
                           │
                           ▼
                       Audit Trail
