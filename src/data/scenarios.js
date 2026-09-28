export const scenarios = {
  B: {
    id: "B",
    label: "Scenario B - Safe Rename",
    description: "custName renamed to customerName. High-confidence match, auto-repaired.",
    entry: {
      timestamp: "2026-09-27T07:27:28.282158+00:00",
      detected_change: [
        { change_type: "field_removed", field: "custName", possible_rename_candidates: ["customerName"] },
        { change_type: "field_added", field: "customerName" }
      ],
      semantic_match: {
        match_type: "strong",
        matched_field: "customerName",
        confidence: 95,
        reasoning: "'customerName' is an unabbreviated direct equivalent of 'custName'."
      },
      proposed_repair: {
        action: "repair_generated",
        before: { source_field: "custName", target_field: "CustomerName" },
        after: { source_field: "customerName", target_field: "CustomerName" }
      },
      validation_result: {
        validation_result: "pass",
        generated_target_payload: "<Customer><CustomerName>ABC Corporation</CustomerName><Amount>25000</Amount></Customer>"
      },
      gate_decision: {
        decision: "AUTO_RELEASE",
        reason: "High confidence (95) strong match"
      },
      rollback_reference: {
        original_mapping: { source_field: "custName", target_field: "CustomerName" }
      }
    }
  },

  C: {
    id: "C",
    label: "Scenario C - Ambiguous Drift",
    description: "custName possibly renamed to customerIdentifier. Low-confidence, refused auto-repair.",
    entry: {
      timestamp: "2026-09-27T07:27:42.755205+00:00",
      detected_change: [
        { field: "custName", possible_rename_candidates: ["customerIdentifier"] }
      ],
      semantic_match: {
        match_type: "no_match",
        matched_field: null,
        confidence: 85,
        reasoning: "A customer name and a customer identifier represent fundamentally different business concepts."
      },
      proposed_repair: {
        action: "no_repair_generated",
        reason: "match_type 'no_match' not confident enough"
      },
      validation_result: {
        validation_result: "skipped",
        reason: "repair not generated - confidence too low"
      },
      gate_decision: {
        decision: "NEEDS_APPROVAL",
        reason: "No repair generated - manual review required"
      },
      rollback_reference: {
        original_mapping: null
      }
    }
  },

  D: {
    id: "D",
    label: "Scenario D - Invalid Repair",
    description: "Forced bad field reference. Repair generated but fails validation.",
    entry: {
      timestamp: "2026-09-27T07:27:42.757830+00:00",
      detected_change: [
        { field: "custName" }
      ],
      semantic_match: {
        match_type: "strong",
        matched_field: "nonExistentField",
        confidence: 92,
        reasoning: "Forced test case for invalid repair"
      },
      proposed_repair: {
        action: "repair_generated",
        before: { source_field: "custName", target_field: "CustomerName" },
        after: { source_field: "nonExistentField", target_field: "CustomerName" }
      },
      validation_result: {
        validation_result: "fail",
        reason: "'nonExistentField' not found"
      },
      gate_decision: {
        decision: "REJECT",
        reason: "Validation failed"
      },
      rollback_reference: {
        original_mapping: { source_field: "custName", target_field: "CustomerName" }
      }
    }
  }
};