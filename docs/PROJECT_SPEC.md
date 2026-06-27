# ProofLedger AI — Project Spec

## Fixed Product Sentence

ProofLedger AI is evidence memory for AI-agent decisions.

It stores each AI-agent recommendation as a DynamoDB receipt and shows whether the packet is HOLD, BLOCK, or HUMAN_REVIEW_ONLY.

## Business Scenario

High-value refund exception.

A customer requests a $1,250 refund. An AI agent prepares a recommendation. ProofLedger records the evidence packet, checks policy and action boundaries, and opens only a human review path when the packet is complete.

## Core Claims

- AI recommendation is not approval.
- Database record is not just storage; it is the evidence memory of what was claimed.
- The app never executes the external business action.
- The strongest result is human review only.

## Out of Scope

- real payment/refund API
- real customer data
- production approval
- compliance certification
- security certification
- private verifier internals
- hidden thresholds
