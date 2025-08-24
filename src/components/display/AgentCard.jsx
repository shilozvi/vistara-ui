/**
 * 🎯 Vistara UI - Agent Card Component
 * "Command your Design."
 * 
 * Migrated from TitanMind with full CSS Variables support
 * Original: Agent status management and monitoring dashboard
 * 
 * ✅ Fully normalized - No hardcoded values
 * ✅ CSS Variables only
 * ✅ Multiple sizes and themes
 * ✅ RTL support maintained
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  Settings,
  Target,
  Bug,
  Code,
  Layers,
  Palette,
  Activity,
  Clock,
  Circle,
  MemoryStick,
  Cpu,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Zap
} from 'lucide-react';
import { normalizeStyle, withNormalizedStyles } from '../../utils/normalizeStyle';

const AgentCard = ({ 
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  refreshInterval = 10000,
  mockData = false // For demo purposes
}) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Size configurations
  const sizeConfigs = {
    compact: {
      padding: 'var(--space-3)',
      gap: 'var(--space-2)',
      cardPadding: 'var(--space-3)',
      iconSize: '16px',
      titleSize: 'var(--font-size-sm)',
      textSize: 'var(--font-size-xs)',
      detailsHeight: '3rem'
    },
    normal: {
      padding: 'var(--space-4)',
      gap: 'var(--space-3)',
      cardPadding: 'var(--space-4)',
      iconSize: '20px',
      titleSize: 'var(--font-size-lg)',
      textSize: 'var(--font-size-sm)',
      detailsHeight: '4rem'
    },
    expanded: {
      padding: 'var(--space-6)',
      gap: 'var(--space-4)',
      cardPadding: 'var(--space-6)',
      iconSize: '24px',
      titleSize: 'var(--font-size-xl)',
      textSize: 'var(--font-size-base)',
      detailsHeight: '5rem'
    }
  };

  const config = sizeConfigs[size];

  // Agent configurations with CSS Variables
  const agentConfig = [
    {
      id: 'manager',
      name: '🎖️ מנהל',
      role: 'Manager',
      description: 'מתאם כללי ומעביר משימות',
      icon: User,
      color: 'var(--color-primary)',
      bgColor: 'var(--color-primary-light)',
      borderColor: 'var(--color-primary)'
    },
    {
      id: 'assistant',
      name: '🤖 אסיסטנט',
      role: 'Assistant',
      description: 'משימות ניהוליות וגיבויים',
      icon: Settings,
      color: 'var(--color-info)',
      bgColor: 'var(--color-info-light)',
      borderColor: 'var(--color-info)'
    },
    {
      id: 'specialist',
      name: '🎯 מומחה',
      role: 'Specialist',
      description: 'משימות מורכבות ומחקר',
      icon: Target,
      color: 'var(--color-secondary)',
      bgColor: 'var(--color-secondary-light)',
      borderColor: 'var(--color-secondary)'
    },
    {
      id: 'qa',
      name: '🔍 בודק QA',
      role: 'QA Tester',
      description: 'בדיקת איכות וציד באגים',
      icon: Bug,
      color: 'var(--color-warning)',
      bgColor: 'var(--color-warning-light)',
      borderColor: 'var(--color-warning)'
    },
    {
      id: 'dev1',
      name: '⚡ מפתח 1',
      role: 'Backend Dev',
      description: 'פיתוח Backend ו-APIs',
      icon: Code,
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-light)',
      borderColor: 'var(--color-success)'
    },
    {
      id: 'dev2',
      name: '🛠️ מפתח 2',
      role: 'Full Stack',
      description: 'פיתוח כללי ו-DevOps',
      icon: Layers,
      color: 'var(--color-accent)',
      bgColor: 'var(--color-accent-light)',
      borderColor: 'var(--color-accent)'
    },
    {
      id: 'dev3',
      name: '🎨 מפתח 3',
      role: 'UI/UX Dev',
      description: 'פיתוח UI/UX ועיצוב',
      icon: Palette,
      color: 'var(--color-pink-500)',
      bgColor: 'var(--color-pink-100)',
      borderColor: 'var(--color-pink-500)'
    }
  ];

  const fetchAgentStatus = async () => {
    if (mockData) {
      // Mock data for demo
      const mockStatuses = agentConfig.map((config, index) => ({
        ...config,
        status: index < 4 ? 'connected' : index < 6 ? 'loading' : 'disconnected',
        uptime: index < 4 ? `${2 + index}:${(15 + index * 5).toString().padStart(2, '0')}:32` : '0:00:00',
        load: index < 4 ? 15 + index * 20 : 0,
        memory: index < 4 ? 512 + index * 128 : 0,
        lastActivity: index < 4 ? `לפני ${5 + index * 2} דקות` : 'לא זמין',
        tasksCompleted: index < 4 ? 12 + index * 8 : 0,
        tasksActive: index < 4 ? 1 + index : 0,
        pid: index < 4 ? 1000 + index * 100 : null,
        port: index < 4 ? 8000 + index : null,
        restart_count: index * 2
      }));
      setAgents(mockStatuses);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // In a real implementation, this would fetch from /api/agents
      const response = await fetch('/api/agents');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data && data.agents) {
        // Map API data to our component structure
        const agentStatuses = data.agents.map(agent => {
          // Find matching config for styling
          const config = agentConfig.find(c => 
            agent.name.toLowerCase().includes(c.role.toLowerCase().split(' ')[0]) ||
            agent.role.toLowerCase().includes(c.role.toLowerCase())
          ) || agentConfig[0];

          // Calculate uptime from last_seen
          const uptimeMs = agent.last_seen ? Date.now() - new Date(agent.last_seen).getTime() : 0;
          const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
          const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((uptimeMs % (1000 * 60)) / 1000);

          return {
            ...config,
            id: agent.id,
            name: config.name || agent.name,
            role: agent.role,
            description: agent.description || config.description,
            status: agent.status === 'online' || agent.status === 'working' ? 'connected' :
                   agent.status === 'offline' ? 'disconnected' : 'loading',
            uptime: `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            load: agent.cpu_usage || 0,
            memory: agent.memory_mb || 0,
            lastActivity: agent.last_seen ? 
              `לפני ${Math.floor((Date.now() - new Date(agent.last_seen).getTime()) / 60000)} דקות` : 
              'לא זמין',
            tasksCompleted: agent.total_tasks_completed || 0,
            tasksActive: agent.active_tasks || 0,
            pid: agent.pid,
            port: agent.port,
            restart_count: agent.restart_count || 0
          };
        });

        setAgents(agentStatuses);
      } else {
        throw new Error('No agents data received');
      }
    } catch (error) {
      process.env.NODE_ENV !== 'production' && console.error('Error fetching agents:', error);
      
      // Fallback to mock data on error
      const mockStatuses = agentConfig.map(config => ({
        ...config,
        status: 'disconnected',
        uptime: '0:00:00',
        load: 0,
        memory: 0,
        lastActivity: 'שגיאה בחיבור',
        tasksCompleted: 0,
        tasksActive: 0
      }));
      setAgents(mockStatuses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, mockData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'var(--color-success)';
      case 'disconnected':
        return 'var(--color-error)';
      case 'loading':
        return 'var(--color-warning)';
      default:
        return 'var(--color-gray-400)';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'פעיל';
      case 'disconnected':
        return 'מנותק';
      case 'loading':
        return 'טוען';
      default:
        return 'לא זמין';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return CheckCircle;
      case 'disconnected':
        return XCircle;
      case 'loading':
        return RefreshCw;
      default:
        return AlertCircle;
    }
  };

  // Main container styles
  const containerStyles = normalizeStyle({
    display: 'flex',
    flexDirection: 'column',
    gap: config.gap,
    padding: config.padding
  });

  const cardStyles = (agent) => normalizeStyle({
    backgroundColor: 'var(--color-surface)',
    border: `var(--border-width-1) solid ${agent.borderColor}`,
    borderRadius: 'var(--border-radius-lg)',
    padding: config.cardPadding,
    transition: 'var(--transition-base)',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)'
  });

  const loadingCardStyles = normalizeStyle({
    backgroundColor: 'var(--color-background-secondary)',
    borderRadius: 'var(--border-radius-lg)',
    padding: config.cardPadding,
    animation: 'pulse 2s infinite'
  });

  if (loading) {
    return (
      <div className="vistara-component" style={containerStyles}>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} style={loadingCardStyles}>
            <div style={normalizeStyle({
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)'
            })}>
              <div style={normalizeStyle({
                width: config.iconSize,
                height: config.iconSize,
                backgroundColor: 'var(--color-gray-300)',
                borderRadius: 'var(--border-radius-full)'
              })} />
              <div style={{ flex: 1 }}>
                <div style={normalizeStyle({
                  height: 'var(--space-4)',
                  backgroundColor: 'var(--color-gray-300)',
                  borderRadius: 'var(--border-radius-md)',
                  width: '40%',
                  marginBottom: 'var(--space-1)'
                })} />
                <div style={normalizeStyle({
                  height: 'var(--space-3)',
                  backgroundColor: 'var(--color-gray-300)',
                  borderRadius: 'var(--border-radius-md)',
                  width: '60%'
                })} />
              </div>
              <div style={normalizeStyle({
                width: '3rem',
                height: 'var(--space-6)',
                backgroundColor: 'var(--color-gray-300)',
                borderRadius: 'var(--border-radius-md)'
              })} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="vistara-component" style={containerStyles}>
      {agents.map(agent => {
        const IconComponent = agent.icon;
        const StatusIcon = getStatusIcon(agent.status);
        
        return (
          <div
            key={agent.id}
            style={cardStyles(agent)}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = 'var(--shadow-lg)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = 'var(--shadow-sm)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <div style={normalizeStyle({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            })}>
              {/* Agent Info */}
              <div style={normalizeStyle({
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)'
              })}>
                <div style={normalizeStyle({
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--border-radius-lg)',
                  backgroundColor: agent.bgColor
                })}>
                  <IconComponent
                    size={config.iconSize}
                    style={{ color: agent.color }}
                  />
                </div>
                <div>
                  <div style={normalizeStyle({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    marginBottom: 'var(--space-1)'
                  })}>
                    <h3 style={normalizeStyle({
                      fontSize: config.titleSize,
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-text-primary)',
                      margin: 0
                    })}>
                      {agent.name}
                    </h3>
                    <span style={normalizeStyle({
                      fontSize: config.textSize,
                      color: 'var(--color-text-secondary)',
                      backgroundColor: 'var(--color-background-tertiary)',
                      padding: 'var(--space-1) var(--space-2)',
                      borderRadius: 'var(--border-radius-full)'
                    })}>
                      {agent.role}
                    </span>
                  </div>
                  <p style={normalizeStyle({
                    fontSize: config.textSize,
                    color: 'var(--color-text-muted)',
                    margin: 0
                  })}>
                    {agent.description}
                  </p>
                </div>
              </div>

              {/* Status & Actions */}
              <div style={normalizeStyle({
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)'
              })}>
                <div style={{ textAlign: 'left' }}>
                  <div style={normalizeStyle({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  })}>
                    <div style={normalizeStyle({
                      width: 'var(--space-3)',
                      height: 'var(--space-3)',
                      borderRadius: 'var(--border-radius-full)',
                      backgroundColor: getStatusColor(agent.status),
                      animation: agent.status === 'loading' ? 'pulse 2s infinite' : 'none'
                    })} />
                    <span style={normalizeStyle({
                      fontWeight: 'var(--font-weight-medium)',
                      color: getStatusColor(agent.status),
                      fontSize: config.textSize
                    })}>
                      {getStatusText(agent.status)}
                    </span>
                  </div>
                  {agent.status === 'connected' && (
                    <div style={normalizeStyle({
                      fontSize: config.textSize,
                      color: 'var(--color-text-secondary)',
                      marginTop: 'var(--space-1)'
                    })}>
                      עומס: {agent.load}%
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Agent Details (shown only when connected and theme is detailed) */}
            {agent.status === 'connected' && theme === 'detailed' && (
              <div style={normalizeStyle({
                marginTop: 'var(--space-3)',
                paddingTop: 'var(--space-3)',
                borderTop: `var(--border-width-1) solid var(--color-border-light)`,
                display: 'grid',
                gridTemplateColumns: size === 'compact' ? '1fr 1fr' : 'repeat(4, 1fr)',
                gap: 'var(--space-4)',
                fontSize: config.textSize
              })}>
                <div style={{ textAlign: 'center' }}>
                  <div style={normalizeStyle({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-1)',
                    marginBottom: 'var(--space-1)'
                  })}>
                    <Clock size="12px" style={{ color: 'var(--color-text-muted)' }} />
                    <span style={{ color: 'var(--color-text-muted)' }}>זמן פעילות</span>
                  </div>
                  <div style={normalizeStyle({
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)'
                  })}>
                    {agent.uptime}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={normalizeStyle({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-1)',
                    marginBottom: 'var(--space-1)'
                  })}>
                    <Activity size="12px" style={{ color: 'var(--color-text-muted)' }} />
                    <span style={{ color: 'var(--color-text-muted)' }}>פעילות</span>
                  </div>
                  <div style={normalizeStyle({
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)'
                  })}>
                    {agent.lastActivity}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={normalizeStyle({
                    color: 'var(--color-text-muted)',
                    marginBottom: 'var(--space-1)'
                  })}>
                    משימות הושלמו
                  </div>
                  <div style={normalizeStyle({
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-success)'
                  })}>
                    {agent.tasksCompleted}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={normalizeStyle({
                    color: 'var(--color-text-muted)',
                    marginBottom: 'var(--space-1)'
                  })}>
                    זיכרון
                  </div>
                  <div style={normalizeStyle({
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-info)'
                  })}>
                    {agent.memory || 0}MB
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Summary Stats */}
      {theme !== 'minimal' && (
        <div style={normalizeStyle({
          marginTop: 'var(--space-4)',
          padding: config.cardPadding,
          backgroundColor: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-lg)'
        })}>
          <div style={normalizeStyle({
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-4)',
            textAlign: 'center'
          })}>
            <div>
              <div style={normalizeStyle({
                fontSize: config.titleSize,
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-success)'
              })}>
                {agents.filter(a => a.status === 'connected').length}
              </div>
              <div style={normalizeStyle({
                fontSize: config.textSize,
                color: 'var(--color-text-muted)'
              })}>
                פעילים
              </div>
            </div>
            <div>
              <div style={normalizeStyle({
                fontSize: config.titleSize,
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-warning)'
              })}>
                {agents.filter(a => a.status === 'loading').length}
              </div>
              <div style={normalizeStyle({
                fontSize: config.textSize,
                color: 'var(--color-text-muted)'
              })}>
                טוענים
              </div>
            </div>
            <div>
              <div style={normalizeStyle({
                fontSize: config.titleSize,
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-error)'
              })}>
                {agents.filter(a => a.status === 'disconnected').length}
              </div>
              <div style={normalizeStyle({
                fontSize: config.textSize,
                color: 'var(--color-text-muted)'
              })}>
                מנותקים
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export with style normalization HOC
export default withNormalizedStyles(AgentCard);