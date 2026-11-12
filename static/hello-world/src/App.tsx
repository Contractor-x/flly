import React, { useState } from 'react';
import { invoke } from '@forge/bridge';
import { INITIAL_AIRCRAFT, SEED_COMPONENTS } from './data/seedCatalogue';
import { AircraftConfiguration, ComponentRecord } from './types/aerospace';
import { calculateAircraftPerformance, CalculationResult } from './engine/engineeringEngine';
import { runDeterministicSimulation, SimulationRunResult } from './engine/simulationEngine';
import { Viewport3D } from './engine/scene/Viewport3D';

export default function App() {
  const [activeTab, setActiveTab] = useState<'assembly' | 'simulation' | 'diagnostics' | 'learning' | 'jira'>('assembly');
  const [aircraft, setAircraft] = useState<AircraftConfiguration>(INITIAL_AIRCRAFT);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [simulationResult, setSimulationResult] = useState<SimulationRunResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [jiraStatus, setJiraStatus] = useState<string>('Not linked');
  const [resolverText, setResolverText] = useState<string>('Standalone Mode');

  // Live performance calculation
  const performance: CalculationResult = calculateAircraftPerformance(aircraft);

  React.useEffect(() => {
    try {
      invoke<{ example: string }, string>('getText', { example: 'init' })
        .then((res) => setResolverText(res ? String(res) : 'Forge Connected'))
        .catch(() => setResolverText('Standalone Mode'));
    } catch (err) {
      setResolverText('Standalone Mode');
    }
  }, []);

  const handleAddComponent = (component: ComponentRecord) => {
    const newInstance = {
      instanceId: `inst-${Date.now()}`,
      componentId: component.id,
      name: component.name,
      category: component.category,
      mass: component.mass,
      position: { x: (Math.random() - 0.5) * 4, y: 0, z: (Math.random() - 0.5) * 2 }
    };
    const updatedComponents = [...aircraft.components, newInstance];
    const updatedMass = updatedComponents.reduce((sum, c) => sum + c.mass.value, 0);
    setAircraft({
      ...aircraft,
      components: updatedComponents,
      totalMass: { value: updatedMass, unit: 'kg' }
    });
  };

  const handleRemoveComponent = (instanceId: string) => {
    const updatedComponents = aircraft.components.filter((c) => c.instanceId !== instanceId);
    const updatedMass = updatedComponents.reduce((sum, c) => sum + c.mass.value, 0);
    setAircraft({
      ...aircraft,
      components: updatedComponents,
      totalMass: { value: updatedMass, unit: 'kg' }
    });
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const result = runDeterministicSimulation(aircraft);
      setSimulationResult(result);
      setIsSimulating(false);
      setActiveTab('simulation');
    }, 400);
  };

  const handleLinkJira = () => {
    setJiraStatus('Linked to FLLY-101: Baseline Flight Verification');
  };

  const filteredComponents = selectedCategory === 'all'
    ? SEED_COMPONENTS
    : SEED_COMPONENTS.filter(c => c.category === selectedCategory);

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <header style={styles.header}>
        <div style={styles.headerTitleArea}>
          <div style={styles.logoBadge}>FLLY</div>
          <div>
            <h1 style={styles.title}>FLLY Aerospace Platform</h1>
            <p style={styles.subtitle}>Aerospace Engineering Education & Aircraft Design Specification</p>
          </div>
        </div>
        <div style={styles.headerStatus}>
          <span style={styles.statusDot} />
          <span style={styles.statusText}>Mode: {resolverText}</span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={styles.navBar}>
        <button
          style={{ ...styles.navButton, ...(activeTab === 'assembly' ? styles.navButtonActive : {}) }}
          onClick={() => setActiveTab('assembly')}
        >
          1. Component Assembly & 3D ({aircraft.components.length})
        </button>
        <button
          style={{ ...styles.navButton, ...(activeTab === 'simulation' ? styles.navButtonActive : {}) }}
          onClick={() => setActiveTab('simulation')}
        >
          2. Flight Simulation {simulationResult ? '✓' : ''}
        </button>
        <button
          style={{ ...styles.navButton, ...(activeTab === 'diagnostics' ? styles.navButtonActive : {}) }}
          onClick={() => setActiveTab('diagnostics')}
        >
          3. Engineering Diagnostics
        </button>
        <button
          style={{ ...styles.navButton, ...(activeTab === 'learning' ? styles.navButtonActive : {}) }}
          onClick={() => setActiveTab('learning')}
        >
          4. Aerospace Learning
        </button>
        <button
          style={{ ...styles.navButton, ...(activeTab === 'jira' ? styles.navButtonActive : {}) }}
          onClick={() => setActiveTab('jira')}
        >
          5. Jira Integration
        </button>
      </nav>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        {activeTab === 'assembly' && (
          <div>
            {/* 3D Viewport Section */}
            <div style={{ ...styles.card, marginBottom: '24px' }}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>3D Aircraft Viewport (Three.js Engine)</h2>
                <span style={styles.tag}>Real-time Schematic Inspection</span>
              </div>
              <Viewport3D aircraft={aircraft} />
            </div>

            <div style={styles.gridTwoColumn}>
              {/* Left: Catalogue */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>Component Catalogue</h2>
                  <div style={styles.filterBar}>
                    {['all', 'wings', 'fuselage', 'engines', 'landing-gear', 'control-surfaces'].map((cat) => (
                      <button
                        key={cat}
                        style={{
                          ...styles.filterChip,
                          ...(selectedCategory === cat ? styles.filterChipActive : {})
                        }}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={styles.catalogueList}>
                  {filteredComponents.map((comp) => (
                    <div key={comp.id} style={styles.catalogueItem}>
                      <div>
                        <h4 style={styles.itemName}>{comp.name}</h4>
                        <p style={styles.itemDesc}>{comp.description}</p>
                        <span style={styles.tag}>Mass: {comp.mass.value} {comp.mass.unit}</span>
                        <span style={{ ...styles.tag, background: '#E3FCEF', color: '#006644' }}>
                          {comp.verificationStatus}
                        </span>
                      </div>
                      <button
                        style={styles.addButton}
                        onClick={() => handleAddComponent(comp)}
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Aircraft Assembly & Metrics */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>Active Configuration: {aircraft.name}</h2>
                  <button
                    style={styles.primaryButton}
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                  >
                    {isSimulating ? 'Simulating...' : '▶ Run Simulation'}
                  </button>
                </div>

                {/* Metrics Summary */}
                <div style={styles.metricsGrid}>
                  <div style={styles.metricBox}>
                    <span style={styles.metricLabel}>Total Mass</span>
                    <span style={styles.metricValue}>{performance.totalMass.value} {performance.totalMass.unit}</span>
                  </div>
                  <div style={styles.metricBox}>
                    <span style={styles.metricLabel}>Weight (W)</span>
                    <span style={styles.metricValue}>{performance.weight.value} {performance.weight.unit}</span>
                  </div>
                  <div style={styles.metricBox}>
                    <span style={styles.metricLabel}>Lift (L)</span>
                    <span style={styles.metricValue}>{performance.lift.value} {performance.lift.unit}</span>
                  </div>
                  <div style={styles.metricBox}>
                    <span style={styles.metricLabel}>Center of Gravity (X)</span>
                    <span style={styles.metricValue}>{performance.centreOfGravity.x.value} {performance.centreOfGravity.x.unit}</span>
                  </div>
                </div>

                <h3 style={styles.sectionSubtitle}>Attached Components ({aircraft.components.length})</h3>
                <div style={styles.attachedList}>
                  {aircraft.components.map((inst) => (
                    <div key={inst.instanceId} style={styles.attachedItem}>
                      <div>
                        <strong>{inst.name}</strong>
                        <span style={{ marginLeft: '12px', color: '#5E6C84', fontSize: '13px' }}>
                          {inst.mass.value} {inst.mass.unit}
                        </span>
                      </div>
                      <button
                        style={styles.removeButton}
                        onClick={() => handleRemoveComponent(inst.instanceId)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'simulation' && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Deterministic Flight Simulation Results</h2>
              <button style={styles.primaryButton} onClick={handleRunSimulation}>
                Re-run Simulation
              </button>
            </div>
            {simulationResult ? (
              <div>
                <div style={styles.metricsGrid}>
                  <div style={styles.metricBox}>
                    <span style={styles.metricLabel}>Run ID</span>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{simulationResult.runId}</span>
                  </div>
                  <div style={styles.metricBox}>
                    <span style={styles.metricLabel}>Final State</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#006644', textTransform: 'uppercase' }}>
                      {simulationResult.finalState}
                    </span>
                  </div>
                  <div style={styles.metricBox}>
                    <span style={styles.metricLabel}>Duration</span>
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>{simulationResult.durationSeconds} s</span>
                  </div>
                </div>

                <h3 style={styles.sectionSubtitle}>Telemetry Log ({simulationResult.telemetry.length} samples)</h3>
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Time</th>
                        <th style={styles.th}>Airspeed</th>
                        <th style={styles.th}>Altitude</th>
                        <th style={styles.th}>Lift</th>
                        <th style={styles.th}>Drag</th>
                        <th style={styles.th}>State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulationResult.telemetry.map((t, idx) => (
                        <tr key={idx} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
                          <td style={styles.td}>{t.time.value} {t.time.unit}</td>
                          <td style={styles.td}>{t.airspeed.value} {t.airspeed.unit}</td>
                          <td style={styles.td}>{t.altitude.value} {t.altitude.unit}</td>
                          <td style={styles.td}>{t.lift.value} {t.lift.unit}</td>
                          <td style={styles.td}>{t.drag.value} {t.drag.unit}</td>
                          <td style={styles.td}>
                            <span style={styles.stateBadge}>{t.state}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p>No simulation run yet. Assemble your aircraft and click "Run Simulation".</p>
                <button style={styles.primaryButton} onClick={handleRunSimulation}>
                  Run Simulation Now
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Engineering Diagnostics & Analysis</h2>
            <p style={{ color: '#5E6C84', marginBottom: '20px' }}>
              Evidence-based evaluation of force balances, centre of gravity, and aerodynamic limits.
            </p>
            {simulationResult && simulationResult.diagnostics.length > 0 ? (
              simulationResult.diagnostics.map((diag, i) => (
                <div key={i} style={styles.diagnosticCard}>
                  <div style={styles.diagHeader}>
                    <span style={styles.diagCode}>{diag.code}</span>
                    <span style={styles.diagTitle}>{diag.title}</span>
                  </div>
                  <p style={styles.diagFinding}><strong>Finding:</strong> {diag.primaryFinding}</p>
                  <p style={styles.diagExplanation}>{diag.explanation}</p>
                  <div style={styles.evidenceBox}>
                    <strong>Supporting Evidence:</strong>
                    <ul>
                      {diag.evidence.map((ev, idx) => (
                        <li key={idx}>
                          {ev.parameter}: {ev.value} {ev.unit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.diagnosticCard}>
                <h4 style={{ color: '#0052CC', marginTop: 0 }}>Baseline Aerodynamic Equilibrium</h4>
                <p>Mass: {performance.totalMass.value} kg | Lift: {performance.lift.value} N | Weight: {performance.weight.value} N</p>
                <p>Run a flight simulation to generate dynamic diagnostic findings.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'learning' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Aerospace Engineering Reference</h2>
            <div style={styles.learningGrid}>
              <div style={styles.learnCard}>
                <h4>Lift Equation</h4>
                <p style={styles.equation}>L = ½ ρ V² S C_L</p>
                <p style={styles.learnDesc}>Generated lift depends on air density (ρ), velocity (V), wing area (S), and lift coefficient (C_L).</p>
              </div>
              <div style={styles.learnCard}>
                <h4>Drag Equation</h4>
                <p style={styles.equation}>D = ½ ρ V² S C_D</p>
                <p style={styles.learnDesc}>Aerodynamic drag opposing motion determined by drag coefficient and dynamic pressure.</p>
              </div>
              <div style={styles.learnCard}>
                <h4>Center of Gravity</h4>
                <p style={styles.equation}>x_CG = Σ(m_i · x_i) / Σ(m_i)</p>
                <p style={styles.learnDesc}>Three-dimensional mass distribution determining static longitudinal and lateral stability.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jira' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Atlassian Jira Integration</h2>
            <p style={{ color: '#5E6C84', marginBottom: '16px' }}>
              Connect aircraft configurations and test diagnostics to Jira issues for engineering review.
            </p>
            <div style={styles.jiraBox}>
              <p><strong>Current Status:</strong> {jiraStatus}</p>
              <button style={styles.primaryButton} onClick={handleLinkJira}>
                Link to Jira Issue FLLY-101
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: '#F4F5F7',
    minHeight: '100vh',
    color: '#172B4D',
    paddingBottom: '40px'
  },
  header: {
    background: '#0747A6',
    color: '#FFFFFF',
    padding: '20px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  headerTitleArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  logoBadge: {
    background: '#00B8D9',
    color: '#091E42',
    fontWeight: 800,
    fontSize: '20px',
    padding: '8px 14px',
    borderRadius: '6px'
  },
  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 700,
    letterSpacing: '-0.3px'
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    opacity: 0.85
  },
  headerStatus: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.15)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    background: '#36B37E',
    borderRadius: '50%',
    marginRight: '8px'
  },
  statusText: {
    color: '#FFFFFF'
  },
  navBar: {
    background: '#FFFFFF',
    display: 'flex',
    borderBottom: '1px solid #DFE1E6',
    padding: '0 24px',
    gap: '8px'
  },
  navButton: {
    background: 'transparent',
    border: 'none',
    padding: '14px 18px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#5E6C84',
    cursor: 'pointer',
    borderBottom: '3px solid transparent'
  },
  navButtonActive: {
    color: '#0747A6',
    borderBottomColor: '#0747A6'
  },
  mainContent: {
    padding: '24px 32px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  gridTwoColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px'
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #DFE1E6'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  cardTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 700,
    color: '#172B4D'
  },
  filterBar: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap'
  },
  filterChip: {
    background: '#F4F5F7',
    border: '1px solid #DFE1E6',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    cursor: 'pointer',
    color: '#5E6C84',
    textTransform: 'capitalize'
  },
  filterChipActive: {
    background: '#DEEBFF',
    color: '#0747A6',
    borderColor: '#B3D4FF',
    fontWeight: 600
  },
  catalogueList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '550px',
    overflowY: 'auto'
  },
  catalogueItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: '#FAFBFC',
    border: '1px solid #EBECF0',
    borderRadius: '6px'
  },
  itemName: {
    margin: '0 0 4px 0',
    fontSize: '15px',
    color: '#172B4D'
  },
  itemDesc: {
    margin: '0 0 8px 0',
    fontSize: '13px',
    color: '#5E6C84'
  },
  tag: {
    display: 'inline-block',
    background: '#DEEBFF',
    color: '#0747A6',
    fontSize: '11px',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: '4px',
    marginRight: '6px',
    textTransform: 'capitalize'
  },
  addButton: {
    background: '#0052CC',
    color: '#FFFFFF',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '13px'
  },
  primaryButton: {
    background: '#0052CC',
    color: '#FFFFFF',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '20px'
  },
  metricBox: {
    background: '#F4F5F7',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #DFE1E6',
    textAlign: 'center'
  },
  metricLabel: {
    display: 'block',
    fontSize: '11px',
    color: '#5E6C84',
    textTransform: 'uppercase',
    marginBottom: '4px',
    fontWeight: 600
  },
  metricValue: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#172B4D'
  },
  sectionSubtitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#172B4D',
    marginTop: '16px',
    marginBottom: '10px'
  },
  attachedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '300px',
    overflowY: 'auto'
  },
  attachedItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    background: '#FAFBFC',
    border: '1px solid #EBECF0',
    borderRadius: '6px',
    fontSize: '14px'
  },
  removeButton: {
    background: 'transparent',
    color: '#DE350B',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600
  },
  tableContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
    border: '1px solid #DFE1E6',
    borderRadius: '6px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    textAlign: 'left'
  },
  th: {
    background: '#F4F5F7',
    padding: '10px 12px',
    borderBottom: '2px solid #DFE1E6',
    color: '#5E6C84',
    fontWeight: 600
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #EBECF0'
  },
  trEven: {
    background: '#FFFFFF'
  },
  trOdd: {
    background: '#FAFBFC'
  },
  stateBadge: {
    background: '#DEEBFF',
    color: '#0747A6',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#5E6C84'
  },
  diagnosticCard: {
    background: '#FAFBFC',
    border: '1px solid #DFE1E6',
    borderRadius: '6px',
    padding: '16px',
    marginBottom: '16px'
  },
  diagHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px'
  },
  diagCode: {
    background: '#DEEBFF',
    color: '#0747A6',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 700
  },
  diagTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#172B4D'
  },
  diagFinding: {
    margin: '0 0 6px 0',
    fontSize: '14px'
  },
  diagExplanation: {
    margin: '0 0 12px 0',
    fontSize: '13px',
    color: '#5E6C84'
  },
  evidenceBox: {
    background: '#FFFFFF',
    padding: '10px 14px',
    borderRadius: '4px',
    border: '1px solid #EBECF0',
    fontSize: '13px'
  },
  learningGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px'
  },
  learnCard: {
    background: '#FAFBFC',
    border: '1px solid #DFE1E6',
    borderRadius: '6px',
    padding: '16px'
  },
  equation: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#0747A6',
    margin: '8px 0'
  },
  learnDesc: {
    fontSize: '13px',
    color: '#5E6C84',
    margin: 0
  },
  jiraBox: {
    background: '#FAFBFC',
    border: '1px solid #DFE1E6',
    borderRadius: '6px',
    padding: '20px'
  }
};
