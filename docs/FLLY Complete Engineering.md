# FLLY — Complete Engineering Specification

**Product:** FLLY  
**Category:** Aerospace Engineering Education and Aircraft Design Platform  
**Platform:** Atlassian Forge + React + Three.js  
**AI:** JEV by TypeSafe AI (subject to API availability)  
**Knowledge Integration:** FLLY Aerospace MCP  
**Development Approach:** Sequential, phase-gated implementation

---

# 1. MASTER SPECIFICATION

## 1.1 Product Vision

FLLY is an aerospace engineering education and aircraft design platform that enables users to explore aerospace engineering concepts, assemble aircraft from real-world components, experiment with aircraft configurations, and evaluate their designs through mathematically grounded simulations.

The platform combines:

- Aerospace education and technical references.
- A searchable aircraft component catalogue.
- A 3D aircraft assembly environment.
- Engineering calculations and configuration validation.
- Simplified mathematical flight simulation.
- Evidence-based engineering diagnostics.
- AI-assisted technical interpretation.
- Atlassian Jira integration.
- A standalone aerospace knowledge MCP server.

FLLY is not intended to be a professional CAD replacement, CFD platform, or high-fidelity flight simulator.

Its objective is to make aircraft engineering concepts interactive, measurable, and understandable.

## 1.2 Core Functionalities

### A. Aerospace Learning

Users should be able to access:

- Aerodynamics.
- Flight mechanics.
- Aircraft structures.
- Propulsion systems.
- Aircraft stability and control.
- Aircraft configurations.
- Engineering equations.
- Technical references.

Learning content should connect directly to the aircraft design environment.

For example, when a learner selects an aircraft wing, FLLY should be able to explain lift generation, wing geometry, aspect ratio, and relevant aerodynamic equations.

### B. Aircraft Component Catalogue

Users should be able to access real aircraft components, including:

- Wings.
- Fuselages.
- Engines.
- Landing gear.
- Propellers.
- Control surfaces.
- Fuel systems.
- Avionics.
- Other aircraft systems.

Components may be associated with known aircraft families, such as the F-22 or Boeing 727, where reliable source information is available.

Each component should support relevant properties:

- Name.
- Manufacturer.
- Model.
- Description.
- Mass.
- Dimensions.
- Geometry.
- Engineering properties.
- Attachment interfaces.
- Source references.
- Verification status.

Do not manually hardcode thousands or millions of components. The catalogue must be data-driven and support future ingestion pipelines.

### C. Aircraft Assembly Environment

The user should be able to:

1. Create an aircraft configuration.
2. Browse the component catalogue.
3. Select components.
4. Add components to an aircraft.
5. Position and attach components.
6. Inspect component properties.
7. Modify supported experimental parameters.
8. Validate the configuration.
9. Save and reload aircraft configurations.

Experimental modifications must not overwrite original manufacturer specifications.

The system should distinguish between:

- Original catalogue values.
- User modifications.
- Estimated values.
- Experimental values.
- Verified technical information.

Allow experimental configurations with appropriate warnings instead of automatically prohibiting every incompatible combination.

### D. Engineering Analysis

FLLY should calculate relevant aircraft properties, including:

- Aircraft mass.
- Centre of gravity.
- Lift.
- Drag.
- Thrust.
- Weight.
- Relevant force balances.
- Basic configuration compatibility.

Calculations must be deterministic and independently testable.

### E. Flight Simulation

FLLY should provide a simplified mathematical simulation of aircraft performance.

It should evaluate whether a configuration can achieve modeled flight conditions and explain why a configuration succeeds or fails.

The simulator must not claim full CFD or validated six-degree-of-freedom simulation unless those capabilities are actually implemented and validated.

### F. Engineering Diagnostics

When an aircraft configuration fails a simulation or validation check, FLLY should explain:

- What happened.
- Why it happened.
- Which parameters contributed.
- Which numerical values support the conclusion.
- What engineering principles apply.
- What the user could investigate next.

Successful simulations should also explain performance and limitations.

---

# 2. SYSTEM ARCHITECTURE

## 2.1 Main Architecture

The system consists of the following logical components:

| Component | Responsibility |
|---|---|
| Forge application | Jira-hosted application |
| React frontend | User interface and interaction |
| Three.js | 3D rendering |
| Aircraft domain model | Authoritative aircraft configuration |
| Component catalogue | Structured component records |
| Engineering engine | Mathematical calculations |
| Simulation engine | Deterministic flight simulation |
| Diagnostics engine | Evidence-based analysis |
| Aerospace MCP | Aerospace knowledge access |
| JEV adapter | Optional decision-support integration |
| Forge resolvers | Authorized Atlassian operations |
| External data layer | Scalable technical data and assets |

## 2.2 Recommended Technology

### Frontend

- React.
- TypeScript.
- Vite.
- Three.js.
- Atlaskit where appropriate.
- Custom CSS.

### Backend and Platform

- Atlassian Forge.
- Forge Bridge.
- Forge resolvers.
- TypeScript.

### Engineering

- Pure TypeScript calculation modules.
- Vitest.
- React Testing Library.
- Playwright where practical.

### Aerospace MCP

- Node.js.
- TypeScript.
- Official MCP TypeScript SDK.
- Zod or equivalent schema validation.
- PostgreSQL when persistent structured storage is required.

Verify current package versions and official API documentation before implementation.

## 2.3 Critical Architectural Separation

Three.js is a rendering engine, not the source of truth for aircraft configurations.

The authoritative aircraft model must be independent of the 3D scene.

The engineering engine must not depend on React or Three.js.

The simulation engine must not depend on animation frame rate.

The Aerospace MCP server must remain separate from Forge resolvers.

JEV must not replace deterministic calculations.

---

# 3. CORE DATA MODELS

## 3.1 Physical Quantity

Every physical quantity must carry an explicit unit.

```ts
interface Quantity {
  value: number;
  unit: string;
}
```

The implementation should use validated unit definitions and canonical internal units.

## 3.2 Component Catalogue Record

```ts
type VerificationStatus =
  | "verified"
  | "manufacturer-published"
  | "secondary-source"
  | "estimated"
  | "experimental"
  | "unverified";

interface ComponentRecord {
  id: string;
  category: string;
  name: string;
  manufacturer?: string;
  model?: string;
  description?: string;

  mass?: Quantity;

  dimensions?: {
    length?: Quantity;
    width?: Quantity;
    height?: Quantity;
    diameter?: Quantity;
  };

  geometry?: GeometryReference;

  interfaces: ComponentInterface[];

  engineeringProperties: Record<
    string,
    Quantity | string | number | boolean
  >;

  provenance: DataProvenance[];

  verificationStatus: VerificationStatus;

  sourceVersion?: string;
  createdAt: string;
  updatedAt: string;
}
```

## 3.3 Aircraft Configuration

```ts
interface AircraftConfiguration {
  id: string;
  name: string;
  description?: string;

  components: ComponentInstance[];
  attachments: ComponentAttachment[];

  aircraftProperties: Record<
    string,
    Quantity | string | number
  >;

  coordinateSystem: CoordinateSystem;

  version: number;

  createdAt: string;
  updatedAt: string;
}
```

## 3.4 Component Instance

A component instance references a catalogue record.

It must not duplicate and independently modify the original manufacturer data.

```ts
interface ComponentInstance {
  instanceId: string;
  componentId: string;
  componentVersion: string;

  transform: Transform3D;

  overrides: ParameterOverride[];
}
```

## 3.5 Experimental Overrides

```ts
interface ParameterOverride {
  parameter: string;

  originalValue: Quantity | number | string;

  overrideValue: Quantity | number | string;

  reason: string;

  createdAt: string;

  createdBy?: string;
}
```

The application must display original and overridden values separately.

---

# 4. ENGINEERING AND SIMULATION REQUIREMENTS

## 4.1 Initial Equations

Lift:

\[
L = \frac{1}{2}\rho V^2 S C_L
\]

Drag:

\[
D = \frac{1}{2}\rho V^2 S C_D
\]

Weight:

\[
W=mg
\]

Simplified longitudinal force balance:

\[
m\frac{dV}{dt}=T-D
\]

This force balance is only valid under its stated simplified assumptions. The implementation must account for relevant force components when modeling climbing, descending, or non-level flight.

Centre of gravity:

\[
x_{CG} = \frac{\sum_i m_i x_i}{\sum_i m_i}
\]

The implementation must extend CG calculations to three dimensions and document the coordinate reference frame.

## 4.2 Simulation Rules

The simulation must:

- Use a fixed timestep.
- Be deterministic.
- Record telemetry.
- Track state transitions.
- Handle invalid configurations.
- Bound execution time and sample counts.
- Separate numerical calculations from visualization.
- Record model assumptions.

Potential flight states:

```text
idle
preflight
accelerating
takeoff
climbing
cruising
descending
stalled
failed
completed
```

Lift exceeding aircraft weight alone must not automatically determine successful takeoff.

## 4.3 Initial Telemetry

```ts
interface TelemetrySample {
  time: Quantity;
  airspeed: Quantity;
  altitude: Quantity;

  lift: Quantity;
  drag: Quantity;
  thrust: Quantity;

  verticalVelocity: Quantity;

  angleOfAttack: Quantity;
  pitchAttitude: Quantity;

  state: FlightState;
}
```

## 4.4 Simulation Result

```ts
interface SimulationResult {
  runId: string;

  status: "completed" | "failed" | "aborted";

  modelVersion: string;

  configurationId: string;

  durationSeconds: number;

  finalState: FlightState;

  metrics: Record<string, unknown>;

  events: SimulationEvent[];

  telemetry: TelemetrySample[];

  diagnostics: Diagnostic[];

  assumptions: string[];

  warnings: string[];
}
```

---

# 5. DIAGNOSTICS ENGINE

Diagnostics must be grounded in actual calculation and simulation results.

Each diagnostic should contain:

```ts
interface Diagnostic {
  code: string;

  severity: "info" | "warning" | "error" | "critical";

  title: string;

  primaryFinding: string;

  contributingFactors: string[];

  evidence: {
    parameter: string;
    value: number;
    unit: string;
  }[];

  explanation: string;

  assumptions: string[];

  investigationSuggestions: string[];
}
```

Examples of possible diagnostic categories:

- Insufficient thrust.
- Excessive aircraft mass.
- Unfavourable centre of gravity.
- Invalid component attachment.
- Insufficient modeled lift.
- Excessive drag.
- Stall condition.
- Invalid aerodynamic configuration.

These must be implemented as actual rules with documented conditions, not simply generated as plausible-sounding text.

---

# 6. DEVELOPMENT ROADMAP

Implementation must follow the phases below sequentially.

Each phase has its own coding-agent prompt and acceptance criteria.

| Phase | Name |
|---|---|
| 00 | Repository Foundation |
| 01 | Application UI |
| 02 | 3D Environment |
| 03 | Component Catalogue and Assembly |
| 04 | Engineering Engine |
| 05 | Flight Simulation |
| 06 | Diagnostics and Analysis |
| 07 | Aerospace MCP |
| 08 | AI and JEV |
| 09 | Atlassian Integration |
| 10 | Testing and Delivery |

Recommended order:

1. Phases 00–06.
2. Phase 07: Aerospace MCP.
3. Phase 08: JEV and AI.
4. Phase 09: Jira integration.
5. Phase 10: final delivery.

Do not implement every phase in one coding-agent session.

---

# 7. PHASE 00 — REPOSITORY FOUNDATION

## Objective

Stabilize the existing Forge repository and establish a maintainable TypeScript/React foundation.

## Existing Repository

The current application was created from:

`global-full-page-custom-ui`

Existing app ID:

`ari:cloud:ecosystem::app/434645b6-7c26-4dab-bd0a-8218f2d4b4fe`

Reported project structure:

```text
flly/
├── manifest.yml
├── package.json
├── README.md
├── src/
│   └── index.js
└── static/
    └── hello-world/
        ├── index.html
        ├── package.json
        ├── vite.config.js
        └── src/
            ├── App.jsx
            └── index.jsx
```

The agent must inspect the actual repository before changing anything.

## Scope

- Audit repository structure.
- Inspect Forge manifest and package configuration.
- Inspect Vite configuration and frontend entry points.
- Verify build output path.
- Plan migration to TypeScript.
- Establish linting and type-checking.
- Establish environment-variable conventions.
- Preserve the existing Forge app identity.
- Verify frontend-to-resolver communication.

## Constraints

Do not implement aircraft features in this phase.

Do not install Three.js, simulation packages, MCP packages, or JEV dependencies yet.

Do not replace the existing Forge deployment model.

Do not create large empty directory trees.

## Acceptance Criteria

- Existing app ID remains unchanged.
- Frontend production build succeeds.
- Forge validation succeeds.
- Vite output matches the Forge resource path.
- Forge Bridge invocation works.
- Type checking and linting work.
- No secrets are committed.

## Coding-Agent Prompt

You are implementing Phase 00 of FLLY.

Inspect the entire existing repository and git status before modifying files.

Report the current structure, configuration, dependency boundaries, and migration risks.

Preserve the existing Forge app ID and module identity.

Establish a maintainable TypeScript, React, and Vite foundation while retaining a valid Forge Custom UI build.

Do not implement any later-phase functionality.

After implementation, run all available build, type-check, lint, and Forge validation commands.

Report changed files, commands executed, test results, outstanding issues, and acceptance status.

---

# 8. PHASE 01 — APPLICATION UI

## Objective

Build the FLLY application shell and aircraft workspace layout.

## Scope

Create:

- Main application shell.
- Navigation.
- Workspace layout.
- Component library panel.
- Central viewport placeholder.
- Properties inspector.
- Analysis panel.
- Learning/context panel.
- Responsive layouts.
- Loading, empty, and error states.

## Design Requirements

The central workspace should be the primary visual focus.

The application should remain usable on smaller displays.

Use reusable components and consistent design tokens.

Implement accessible labels, keyboard interaction, and visible focus states.

Do not introduce unnecessary animation dependencies.

## Acceptance Criteria

- FLLY loads inside Forge Custom UI.
- Workspace sections are usable.
- Layout works at desktop and narrow viewport sizes.
- Navigation works.
- Loading and error states exist.
- No fake simulation results are presented as real.

## Coding-Agent Prompt

Implement Phase 01 only.

Inspect the Phase 00 foundation before editing.

Build the FLLY application shell and responsive workspace using typed, reusable React components.

Create placeholders for the 3D viewport, component catalogue, inspector, and analysis panel.

Do not implement Three.js, aircraft physics, simulation, MCP, JEV, or Jira workflows.

Add tests for navigation and panel behavior.

Report all changed files and acceptance results.

---

# 9. PHASE 02 — 3D ENVIRONMENT

## Objective

Introduce a reliable Three.js viewport for aircraft geometry visualization and inspection.

## Scope

- Three.js integration.
- Scene initialization.
- Camera.
- Lighting.
- Grid and coordinate axes.
- Orbit, pan, and zoom.
- GLTF/GLB asset loading.
- Component selection.
- Component highlighting.
- Geometry fallback.
- Resource cleanup.

## Architecture

Rendering must remain separate from the aircraft domain model.

Conceptual interface:

```ts
interface ViewportComponent {
  instanceId: string;

  geometryUrl?: string;

  transform: Transform3D;

  displayName: string;
}
```

The viewport receives renderable descriptors and emits selection events.

## Constraints

- Do not load the entire future catalogue.
- Do not store engineering data exclusively in Three.js objects.
- Do not use animation frame delta as simulation time.
- Do not implement advanced CAD mesh editing.

## Acceptance Criteria

- Three.js viewport renders.
- Camera controls work.
- Test GLB loads.
- Missing geometry is handled.
- Component selection emits stable IDs.
- Resources are disposed correctly.
- Domain data remains independent of Three.js.

## Coding-Agent Prompt

Implement Phase 02 only.

Integrate Three.js into the existing FLLY workspace.

Verify package compatibility and current asset-loading APIs.

Create a lifecycle-safe viewport with camera controls, grid, axes, one test geometry asset, component selection, and fallback geometry.

Keep rendering code isolated from the authoritative aircraft model.

Do not implement the component catalogue, physics, simulation, or CAD editing.

Add focused tests and document coordinate and asset conventions.

---

# 10. PHASE 03 — COMPONENT CATALOGUE AND ASSEMBLY

## Objective

Build the data-driven aircraft component catalogue and serializable aircraft assembly model.

## Scope

- Component catalogue schema.
- Aircraft configuration schema.
- Component instances.
- Attachment interfaces.
- Coordinate frames.
- Catalogue search.
- Catalogue filtering.
- Component inspector.
- Component placement.
- Aircraft serialization.
- Experimental parameter overrides.
- Compatibility warnings.
- Versioned configurations.

## Catalogue Strategy

The catalogue must be data-driven.

Start with a small representative dataset.

Do not manually create enormous numbers of components.

Every technical record should retain:

- Source.
- Manufacturer/model where known.
- Units.
- Verification status.
- Record version.
- Licensing metadata where relevant.
- Correction history.

AI-extracted data must not automatically be labelled verified.

## Component Categories

Initial categories:

- Wings.
- Fuselage.
- Engines.
- Landing gear.
- Propellers.
- Control surfaces.
- Fuel systems.
- Avionics.

Only use real manufacturer specifications when supported by reliable sources.

Otherwise label values as illustrative, estimated, or unverified.

## Experimental Overrides

The user may modify supported parameters.

The application must display original and modified values separately.

A modification must not alter the original catalogue record.

Compatibility warnings must explain the mismatch.

## Acceptance Criteria

- Aircraft configurations can be created and reloaded.
- Components reference catalogue records.
- Overrides do not mutate source records.
- Every physical quantity has an explicit unit.
- Attachments use stable IDs.
- Incompatibilities produce explanations.
- Catalogue loading is bounded or paginated.

## Coding-Agent Prompt

Implement Phase 03 only.

Design the aircraft and component domain models before implementing the UI.

Create a small provenance-rich seed catalogue.

Implement component instances, attachment interfaces, serialization, catalogue search, selection, and experimental overrides.

Connect the domain model to the Three.js viewport through an adapter.

Never fabricate manufacturer specifications or overwrite source values.

Add tests for serialization, attachments, overrides, and compatibility warnings.

Do not implement physics or simulation yet.

---

# 11. PHASE 04 — ENGINEERING ENGINE

## Objective

Create a deterministic, independently testable engineering calculation layer.

## Scope

- Quantity and unit utilities.
- Canonical internal units.
- Input validation.
- Lift calculation.
- Drag calculation.
- Weight calculation.
- Centre-of-gravity calculation.
- Relevant propulsion calculations.
- Force-balance calculations.
- Configuration validation.
- Calculation provenance.

## Initial Equations

\[
L = \frac{1}{2}\rho V^2 S C_L
\]

\[
D = \frac{1}{2}\rho V^2 S C_D
\]

\[
W=mg
\]

\[
x_{CG} = \frac{\sum_i m_i x_i}{\sum_i m_i}
\]

Extend CG to three dimensions.

## Engineering Requirements

- Validate numeric inputs.
- Reject invalid physical values.
- Handle missing data explicitly.
- Distinguish unavailable values from zero.
- Validate unit compatibility.
- Avoid unnecessary intermediate rounding.
- Keep presentation formatting outside the calculation core.

## Acceptance Criteria

- Equations pass known-value tests.
- Unit conversions are tested.
- Invalid inputs return structured errors.
- CG calculations work for multiple components.
- Zero total mass is handled.
- Identical inputs produce identical outputs.
- No calculation depends on Three.js or React.
- AI cannot overwrite calculation results.

## Coding-Agent Prompt

Implement Phase 04 only.

Build the engineering calculation layer as pure deterministic TypeScript modules.

Implement explicit quantity/unit contracts, lift, drag, weight, 3D centre of gravity, and applicable force-balance calculations.

Validate physical domains and missing values.

Do not add hidden defaults.

Use independently calculated test fixtures.

Document assumptions and model limitations.

The engine must not import React or Three.js and must not call an AI service.

---

# 12. PHASE 05 — FLIGHT SIMULATION

## Objective

Build a simplified deterministic flight simulation using the engineering engine.

## Scope

- Simulation configuration.
- Environment.
- Initial conditions.
- Fixed timestep.
- Flight model.
- State transitions.
- Telemetry.
- Simulation events.
- Failure detection.
- Simulation controls.
- Results UI.

## Flight States

```text
idle
preflight
accelerating
takeoff
climbing
cruising
descending
stalled
failed
completed
```

Define legal transitions and their mathematical conditions.

## Telemetry

At minimum:

- Time.
- Airspeed.
- Altitude.
- Lift.
- Drag.
- Thrust.
- Vertical velocity.
- Angle of attack.
- Pitch attitude.
- Current state.

All numeric values require units.

## Critical Requirements

- Fixed timestep.
- Deterministic execution.
- Explicit assumptions.
- Bounded execution.
- No dependence on animation frame rate.
- No automatic takeoff decision from lift exceeding weight alone.
- No unsupported high-fidelity simulation claims.

## Acceptance Criteria

- Identical inputs produce identical telemetry.
- State transitions follow documented rules.
- Invalid configurations cannot silently enter simulation.
- Telemetry contains units and model version.
- Simulation runs independently of the viewport.
- Visualization does not influence physical outcomes.
- Execution and memory are bounded.

## Coding-Agent Prompt

Implement Phase 05 only.

First document the mathematical model, state transitions, integration method, timestep, environment assumptions, and limitations.

Then implement a deterministic fixed-step simulator with typed telemetry and events.

Use the Phase 04 engineering engine.

Do not claim full flight-simulator fidelity.

Do not let Three.js animation determine simulation outcomes.

Add tests for determinism, transitions, invalid inputs, and representative successful and failed configurations.

---

# 13. PHASE 06 — DIAGNOSTICS AND ANALYSIS

## Objective

Translate engineering and simulation results into evidence-based explanations.

## Scope

- Diagnostic contracts.
- Deterministic diagnostic rules.
- Severity levels.
- Evidence values.
- Telemetry visualization.
- Performance analysis.
- Report serialization.
- Versioned analysis reports.

## Diagnostic Requirements

Every diagnostic should contain:

- Code.
- Severity.
- Primary finding.
- Contributing factors.
- Evidence values and units.
- Engineering explanation.
- Assumptions.
- Investigation suggestions.

## Rules

Diagnostics must trace to actual calculations, validation rules, or simulation events.

Distinguish root causes from contributing factors.

Do not make unsupported airworthiness claims.

Do not use an LLM to determine whether a simulation succeeded.

Successful runs must also explain performance and limitations.

## Acceptance Criteria

- Every diagnostic contains supporting evidence.
- Identical results produce identical diagnostic outputs.
- Reports identify the aircraft configuration and model version.
- Users can inspect why a result occurred.
- Warnings and failures are visually distinguishable.
- Reports do not claim unsupported engineering validity.

## Coding-Agent Prompt

Implement Phase 06 only.

Build a deterministic diagnostics layer over existing validation, engineering, and simulation outputs.

Define stable diagnostic codes and structured evidence.

Create analysis panels and telemetry visualizations.

Support versioned report serialization.

Ensure every explanation is traceable to numerical evidence and assumptions.

Do not integrate JEV or another generative model in this phase.

---

# 14. PHASE 07 — FLLY AEROSPACE MCP

## Objective

Build a standalone Model Context Protocol server that exposes aerospace knowledge, engineering equations, aircraft information, component data, and technical references.

This is a product service.

It is distinct from Atlassian Forge MCP, which is a developer tool for Atlassian documentation and tooling.

## 14.1 Architecture

```text
FLLY Application / AI Clients
             |
         MCP Protocol
             |
  FLLY Aerospace MCP Server
      | Tools              |
      | Resources          |
      | Prompts            |
             |
       Domain Services
             |
       Knowledge Layer
      | Aircraft DB       |
      | Components        |
      | Equations         |
      | Technical Docs    |
```

The MCP server must be independently deployable and testable.

## 14.2 Recommended Stack

- TypeScript.
- Node.js.
- Official MCP TypeScript SDK.
- Zod or equivalent schema validation.
- PostgreSQL when persistent structured storage is justified.
- Full-text search initially.
- Vector search only when evaluation demonstrates a need.

Verify the current official MCP SDK APIs before implementation.

## 14.3 Suggested Project Structure

```text
services/
└── aerospace-mcp/
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    ├── README.md
    ├── src/
    │   ├── index.ts
    │   ├── server/
    │   │   ├── create-server.ts
    │   │   ├── register-tools.ts
    │   │   ├── register-resources.ts
    │   │   └── register-prompts.ts
    │   ├── domain/
    │   │   ├── aircraft.ts
    │   │   ├── component.ts
    │   │   ├── equation.ts
    │   │   ├── reference.ts
    │   │   └── provenance.ts
    │   ├── services/
    │   │   ├── knowledge-search.service.ts
    │   │   ├── aircraft.service.ts
    │   │   ├── component.service.ts
    │   │   ├── equation.service.ts
    │   │   └── reference.service.ts
    │   ├── repositories/
    │   │   ├── knowledge.repository.ts
    │   │   └── fixture.repository.ts
    │   ├── validation/
    │   │   ├── schemas.ts
    │   │   └── units.ts
    │   └── transport/
    │       └── configure-transport.ts
    ├── data/
    │   └── fixtures/
    └── tests/
        ├── tools/
        ├── resources/
        ├── services/
        └── integration/
```

This is a target structure. Create files as needed rather than generating empty directories.

## 14.4 MCP Tools

### `search_aerospace_knowledge`

Search aerospace technical knowledge.

Input:

- Query.
- Optional topic.
- Optional category.
- Optional source type.
- Optional result limit.

Output:

- Record ID.
- Title.
- Summary.
- Record type.
- Verification status.
- Source references.

### `get_engineering_equation`

Retrieve a specific engineering equation.

Output:

- Equation.
- Variables.
- Units.
- Assumptions.
- Applicability.
- Limitations.
- Sources.

### `search_engineering_equations`

Search equations by topic or engineering discipline.

### `lookup_aircraft`

Retrieve aircraft information by stable ID or supported manufacturer/model search.

### `lookup_aircraft_component`

Retrieve component specifications, dimensions, mass, interfaces, provenance, and verification status.

### `lookup_engine`

Retrieve engine information and available technical specifications.

### `get_technical_reference`

Retrieve technical reference metadata and permitted content.

Do not redistribute copyrighted material unlawfully.

### `compare_aircraft_components`

Compare two or more components.

Normalize comparable units and explicitly identify missing information.

### `validate_component_data`

Validate component records for:

- Schema structure.
- Units.
- Physical value domains.
- Provenance.
- Verification consistency.

Schema validity does not establish engineering truth.

## 14.5 MCP Resources

Initial resource URI patterns:

```text
aerospace://equations
aerospace://equations/aerodynamics
aerospace://equations/flight-mechanics
aerospace://aircraft
aerospace://aircraft/{aircraftId}
aerospace://components
aerospace://components/{componentId}
aerospace://engines
aerospace://references
```

Resource responses must be bounded and versioned.

Do not return the entire catalogue in one response.

## 14.6 MCP Prompts

Initial prompts:

```text
explain_aerodynamic_equation
analyze_aircraft_configuration
explain_component_function
investigate_flight_failure
compare_propulsion_systems
```

Prompts guide clients; they do not replace validated tool outputs.

## 14.7 Provenance Schema

```ts
interface DataProvenance {
  sourceId: string;
  sourceTitle: string;

  organization?: string;
  url?: string;

  publicationDate?: string;
  retrievedAt?: string;

  licence?: string;

  extractionMethod?:
    | "manual"
    | "structured-import"
    | "machine-extracted";

  verificationStatus:
    | "manufacturer-published"
    | "independently-verified"
    | "secondary-source"
    | "estimated"
    | "experimental"
    | "unverified";

  notes?: string;
}
```

Manufacturer-published and independently verified are separate concepts.

AI extraction does not make a record verified.

Preserve original sources, corrections, and record versions.

## 14.8 Knowledge Ingestion Pipeline

```text
Approved Source
      |
Document/Data Ingestion
      |
Text or Structured Extraction
      |
Metadata Normalization
      |
Technical Field Extraction
      |
Unit and Schema Validation
      |
Source Verification
      |
Verification Status Assignment
      |
Knowledge Database
      |
Search Index
      |
MCP Retrieval
```

Respect copyright, database rights, licences, and terms of service.

Do not scrape or redistribute technical documents unlawfully.

## 14.9 Search Strategy

Start with:

- Exact identifier lookup.
- Normalized manufacturer/model lookup.
- Indexed fields.
- Full-text search.

Introduce vector retrieval only if measured search quality requires it.

Exact identifiers, filters, and provenance must remain available even if vector retrieval is later introduced.

## 14.10 Transport

Use stdio for local development if supported by the current SDK.

Choose a suitable remote transport for deployment based on current MCP specifications and hosting requirements.

Do not assume that a browser frontend can directly communicate with a stdio MCP process.

Remote deployments require authentication and authorization.

## 14.11 MCP Acceptance Criteria

- Server initializes with the supported SDK.
- A compatible client discovers tools, resources, and prompts.
- Every tool validates input.
- Fixture records return expected results.
- Missing records return controlled errors.
- Provenance is preserved.
- Invalid units are detected.
- Large responses are bounded.
- Database failures are handled.
- Remote authentication is tested.
- At least one compatible client completes real discovery and lookup.

## 14.12 Coding-Agent Prompt

Implement Phase 07 as a standalone FLLY Aerospace MCP server.

First verify the official MCP TypeScript SDK documentation and select a supported transport.

Keep the MCP server separate from Forge resolvers.

Implement a transport-independent domain/service layer, schema validation, a small provenance-rich fixture dataset, and the tools, resources, and prompts specified in this document.

Do not fabricate aircraft specifications.

Do not redistribute copyrighted technical documents unlawfully.

Start with structured lookup and full-text search. Do not introduce vector infrastructure without a demonstrated need.

Add tests for tool discovery, input validation, missing records, provenance, failures, and compatible-client integration.

Document configuration without committing secrets.

Report exactly which capabilities are implemented, fixture-backed, mocked, or live.

---

# 15. PHASE 08 — AI AND JEV

## Objective

Introduce AI-assisted technical interpretation without compromising engineering correctness.

## JEV Positioning

JEV from TypeSafe AI should be treated as a potential structured decision-support model.

It is not:

- The physics engine.
- A replacement for engineering calculations.
- A source of verified manufacturer specifications.
- A generic RAG system by assumption.
- A deterministic simulation engine.

Reference:

https://typesafe.ai/blog/introducing-system-one-models-and-jev

Before implementation, verify official API/SDK availability, authentication, access requirements, request/response structure, rate limits, and terms.

Do not invent endpoints or SDK methods.

## Adapter

```ts
interface DecisionModel<Input, Output> {
  evaluate(input: Input): Promise<Output>;
}
```

Vendor-specific implementation must remain isolated.

## Suitable Responsibilities

- Rank possible diagnostic investigation paths.
- Map learner questions to relevant aerospace concepts.
- Structure component comparison requests.
- Explain existing diagnostic findings using supplied evidence.

## Prohibited Responsibilities

- Calculate authoritative lift, drag, mass, or CG.
- Alter simulation results.
- Convert unverified data into verified facts.
- Claim aircraft safety or airworthiness.
- Hide assumptions or missing values.

## Fallback

If JEV access is unavailable, use a clearly labelled mock adapter for interface development.

Mock responses must never be presented as live JEV output.

Core engineering and diagnostic workflows must continue functioning without JEV.

## Acceptance Criteria

- Engineering outputs remain unchanged by AI.
- Explanations use supplied evidence.
- Missing information and uncertainty are disclosed.
- Vendor-specific logic is isolated.
- No API secrets appear in frontend code.
- Mock/live status is visible.
- AI failure does not break core workflows.

## Coding-Agent Prompt

Implement Phase 08 only.

Verify TypeSafe AI's official JEV integration options before writing a real adapter.

Do not invent endpoints or SDKs.

Create the vendor-neutral DecisionModel interface and typed FLLY contracts.

If official access is unavailable, provide a clearly labelled mock adapter for integration testing.

Restrict AI to evidence-grounded explanation and decision support.

The deterministic engineering and diagnostics layers remain authoritative.

Test malformed outputs, timeouts, service failures, fallback behavior, and untrusted retrieved content.

---

# 16. PHASE 09 — ATLASSIAN INTEGRATION

## Objective

Connect FLLY's engineering workflow to Jira through the existing Forge application.

## Scope

- Associate aircraft configurations with Jira projects.
- Associate analysis reports with Jira issues.
- Create engineering investigation issues from diagnostic reports.
- Link saved simulation reports.
- Display relevant Jira issue context and status where permitted.
- Handle permission errors.
- Apply least-privilege scopes.
- Validate resolver inputs.

## Security

- Preserve the existing Forge app ID.
- Use Forge Bridge and resolvers appropriately.
- Enforce authorization server-side.
- Never expose credentials in frontend code.
- Request only required permissions.
- Handle API failures and rate limits.

Confluence integration is optional and should be separately scoped after Jira workflows are stable.

## Acceptance Criteria

- Users can associate configurations and reports with Jira.
- Diagnostic reports can create investigation issues.
- Permission failures are handled safely.
- Resolver operations validate and authorize requests.
- Existing Forge identity remains unchanged.
- A dedicated Jira test site verifies the workflow.

## Coding-Agent Prompt

Implement Phase 09 using the existing Forge app.

Inspect the current manifest, resolver, and Bridge APIs before changing them.

Preserve the app ID.

Implement only the Jira workflows described here.

Use typed contracts, server-side authorization, least-privilege scopes, and robust error handling.

Do not put Jira credentials in frontend code.

Do not add Confluence unless separately approved.

Test on a dedicated Jira site or clearly document which integration tests could not be run.

---

# 17. PHASE 10 — DELIVERY AND HARDENING

## Objective

Prepare FLLY for controlled demonstration and release.

## Scope

- Full unit testing.
- Integration testing.
- End-to-end testing.
- Security review.
- Permission review.
- Dependency audit.
- Performance profiling.
- MCP verification.
- JEV status verification.
- Jira integration testing.
- Documentation.
- Deployment guide.
- Demonstration dataset.

## Required End-to-End Workflow

1. Open FLLY inside Jira.
2. Create or load an aircraft configuration.
3. Add components.
4. Inspect component provenance.
5. Validate the aircraft configuration.
6. Run a deterministic simulation.
7. Review telemetry.
8. Inspect diagnostics.
9. Save a report.
10. Create or link a Jira investigation issue.
11. Retrieve relevant aerospace knowledge through MCP where enabled.

## Acceptance Criteria

- Critical workflow passes.
- No unresolved critical security issue.
- Simulation limitations are documented.
- Catalogue records preserve provenance.
- MCP tools are discoverable and tested.
- JEV is correctly labelled live or mock.
- Jira workflows work with intended permissions.
- Build and deployment instructions are reproducible.
- Release documentation distinguishes implemented features from planned capabilities.

## Coding-Agent Prompt

Implement Phase 10 only after previous phases have been accepted.

Do not introduce new product features.

Run the full test, build, and Forge validation workflow.

Review security, permissions, performance, MCP, JEV, and Jira integration.

Resolve defects and hardening issues within this phase.

Produce a release-readiness report, known limitations register, deployment guide, user guide, and reproducible demonstration checklist.

Do not claim capabilities that are not implemented and validated.

---

# 18. FINAL REPOSITORY STRUCTURE

The following is the intended logical destination. It is not a requirement to create empty directories in advance.

```text
flly/
├── manifest.yml
├── package.json
├── tsconfig.json
├── README.md
├── .env.example
│
├── src/
│   ├── index.ts
│   ├── resolvers/
│   │   ├── index.ts
│   │   ├── jira.resolver.ts
│   │   ├── project.resolver.ts
│   │   ├── simulation.resolver.ts
│   │   └── documentation.resolver.ts
│   │
│   ├── services/
│   │   ├── jira.service.ts
│   │   ├── storage.service.ts
│   │   └── external-api.service.ts
│   │
│   └── types/
│
├── static/
│   └── hello-world/
│       ├── package.json
│       ├── vite.config.ts
│       └── src/
│           ├── main.tsx
│           ├── App.tsx
│           ├── app/
│           ├── components/
│           │   ├── layout/
│           │   ├── aircraft/
│           │   ├── simulation/
│           │   ├── diagnostics/
│           │   └── learning/
│           │
│           ├── engine/
│           │   ├── scene/
│           │   ├── aircraft/
│           │   ├── geometry/
│           │   └── interaction/
│           │
│           ├── physics/
│           │   ├── environment/
│           │   ├── aerodynamics/
│           │   ├── propulsion/
│           │   ├── mechanics/
│           │   └── flight/
│           │
│           ├── simulation/
│           ├── diagnostics/
│           ├── validation/
│           ├── data/
│           ├── services/
│           ├── hooks/
│           ├── store/
│           ├── types/
│           ├── utils/
│           ├── styles/
│           └── tests/
│
├── services/
│   └── aerospace-mcp/
│       ├── package.json
│       ├── tsconfig.json
│       ├── README.md
│       ├── .env.example
│       ├── src/
│       ├── data/
│       └── tests/
│
├── docs/
│   ├── MASTER_SPEC.md
│   ├── DEVELOPMENT_ROADMAP.md
│   ├── MCP_BUILD_SPEC.md
│   └── phases/
│       ├── PHASE_00_FOUNDATION.md
│       ├── PHASE_01_APPLICATION_UI.md
│       ├── PHASE_02_3D_ENVIRONMENT.md
│       ├── PHASE_03_COMPONENT_ASSEMBLY.md
│       ├── PHASE_04_ENGINEERING_ENGINE.md
│       ├── PHASE_05_FLIGHT_SIMULATION.md
│       ├── PHASE_06_DIAGNOSTICS.md
│       ├── PHASE_07_AEROSPACE_MCP.md
│       ├── PHASE_08_AI_JEV.md
│       ├── PHASE_09_ATLASSIAN.md
│       └── PHASE_10_DELIVERY.md
│
└── tests/
    ├── integration/
    └── fixtures/
```

---

# 19. AGENT EXECUTION RULES

These rules apply to every coding-agent session.

1. Inspect the repository before making changes.
2. Read the master specification and the active phase document.
3. Do not implement future phases without explicit approval.
4. Present an implementation plan before substantial changes.
5. Preserve existing working functionality.
6. Do not invent external API capabilities.
7. Do not fabricate engineering data.
8. Preserve provenance for technical records.
9. Keep calculations deterministic.
10. Test each phase before proceeding.
11. Document architectural deviations.
12. Report all modified files and test results.
13. Stop at the phase boundary and wait for review.

**Primary development principle:** Build FLLY as a collection of independently testable engineering systems, not as one large UI implementation. The aircraft domain model, rendering layer, engineering engine, simulation engine, diagnostics, MCP service, and Atlassian integration must have explicit boundaries.
