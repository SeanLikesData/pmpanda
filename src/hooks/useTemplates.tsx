import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export const defaultPRDTemplate = `# Product Requirements Document: [Product Name]

## Executive Summary
Brief overview of the product and its purpose.

## Problem Statement
- What problem are we solving?
- Who experiences this problem?
- How significant is this problem?

## Objectives & Success Metrics
### Primary Goals
- Goal 1
- Goal 2
- Goal 3

### Key Metrics
- Metric 1: [Target]
- Metric 2: [Target]
- Metric 3: [Target]

## User Stories & Requirements
### User Personas
- Persona 1: [Description]
- Persona 2: [Description]

### User Stories
- As a [user type], I want [functionality] so that [benefit]
- As a [user type], I want [functionality] so that [benefit]

## Technical Requirements
### Functional Requirements
1. Requirement 1
2. Requirement 2
3. Requirement 3

### Non-Functional Requirements
- Performance: [Requirements]
- Security: [Requirements]
- Scalability: [Requirements]

## Implementation Timeline
### Phase 1: [Timeframe]
- Milestone 1
- Milestone 2

### Phase 2: [Timeframe]
- Milestone 3
- Milestone 4

## Risks & Dependencies
- Risk 1: [Mitigation strategy]
- Dependency 1: [Details]

## Appendix
Additional context, research, or supporting materials.`;

export const defaultSpecTemplate = `# Technical Specification: [Feature Name]

## Overview
High-level description of the technical solution.

## Architecture
### System Architecture
- Component 1: [Description]
- Component 2: [Description]
- Component 3: [Description]

### Data Flow
1. Step 1: [Description]
2. Step 2: [Description]
3. Step 3: [Description]

## API Design
### Endpoints
\`\`\`
GET /api/endpoint1
POST /api/endpoint2
PUT /api/endpoint3
DELETE /api/endpoint4
\`\`\`

### Data Models
\`\`\`typescript
interface Model1 {
  id: string;
  property1: string;
  property2: number;
}

interface Model2 {
  id: string;
  property1: string;
  property2: boolean;
}
\`\`\`

## Database Schema
### Tables
- Table 1: [Description and fields]
- Table 2: [Description and fields]

### Relationships
- Relationship 1: [Description]
- Relationship 2: [Description]

## Security Considerations
- Authentication: [Strategy]
- Authorization: [Strategy] 
- Data Protection: [Strategy]

## Performance Requirements
- Response Time: [Target]
- Throughput: [Target]
- Concurrent Users: [Target]

## Testing Strategy
### Unit Tests
- Test category 1
- Test category 2

### Integration Tests
- Integration scenario 1
- Integration scenario 2

### End-to-End Tests
- User journey 1
- User journey 2

## Deployment Plan
### Infrastructure
- Environment 1: [Configuration]
- Environment 2: [Configuration]

### Rollout Strategy
1. Phase 1: [Details]
2. Phase 2: [Details]
3. Phase 3: [Details]

## Monitoring & Observability
- Metrics to track
- Alerts to configure
- Logging strategy`;

interface Template {
  id: string;
  type: string;
  content: string;
}

export function useTemplates() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prdTemplate, setPrdTemplate] = useState<string>(defaultPRDTemplate);
  const [specTemplate, setSpecTemplate] = useState<string>(defaultSpecTemplate);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTemplates();
    }
  }, [user]);

  const fetchTemplates = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('user_id', user.id);

    if (!error && data) {
      data.forEach((template: Template) => {
        if (template.type === 'prd') {
          setPrdTemplate(template.content);
        } else if (template.type === 'spec') {
          setSpecTemplate(template.content);
        }
      });
    }
    setLoading(false);
  };

  const saveTemplate = async (type: 'prd' | 'spec', content: string) => {
    if (!user) return;

    // Check if template exists
    const { data: existing } = await supabase
      .from('document_templates')
      .select('id')
      .eq('user_id', user.id)
      .eq('type', type)
      .maybeSingle();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('document_templates')
        .update({ content })
        .eq('user_id', user.id)
        .eq('type', type);

      if (error) {
        toast({
          title: "Error saving template",
          description: error.message,
          variant: "destructive"
        });
      } else {
        if (type === 'prd') setPrdTemplate(content);
        else setSpecTemplate(content);
        toast({
          title: "Template saved",
          description: `${type.toUpperCase()} template has been updated successfully.`
        });
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('document_templates')
        .insert({
          user_id: user.id,
          type,
          content,
          is_default: false
        });

      if (error) {
        toast({
          title: "Error saving template",
          description: error.message,
          variant: "destructive"
        });
      } else {
        if (type === 'prd') setPrdTemplate(content);
        else setSpecTemplate(content);
        toast({
          title: "Template saved",
          description: `${type.toUpperCase()} template has been created successfully.`
        });
      }
    }
  };

  const resetTemplate = (type: 'prd' | 'spec') => {
    const defaultTemplate = type === 'prd' ? defaultPRDTemplate : defaultSpecTemplate;
    if (type === 'prd') setPrdTemplate(defaultTemplate);
    else setSpecTemplate(defaultTemplate);
    toast({
      title: "Template reset",
      description: `${type.toUpperCase()} template has been reset to default.`
    });
  };

  return {
    prdTemplate,
    specTemplate,
    loading,
    saveTemplate,
    resetTemplate,
    setPrdTemplate,
    setSpecTemplate
  };
}
