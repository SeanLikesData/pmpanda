import { useState } from "react";
import { FileText, Code, Save, Edit, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useTemplates } from "@/hooks/useTemplates";

export default function Templates() {
  const { 
    prdTemplate, 
    specTemplate, 
    loading, 
    saveTemplate, 
    resetTemplate, 
    setPrdTemplate, 
    setSpecTemplate 
  } = useTemplates();

  const [editMode, setEditMode] = useState<{ prd: boolean; spec: boolean }>({
    prd: false,
    spec: false
  });

  const toggleEditMode = (type: 'prd' | 'spec') => {
    setEditMode(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSaveTemplate = async (type: 'prd' | 'spec') => {
    const content = type === 'prd' ? prdTemplate : specTemplate;
    await saveTemplate(type, content);
    setEditMode(prev => ({ ...prev, [type]: false }));
  };

  const copyTemplate = (type: 'prd' | 'spec') => {
    const content = type === 'prd' ? prdTemplate : specTemplate;
    navigator.clipboard.writeText(content);
  };

  const handleResetTemplate = (type: 'prd' | 'spec') => {
    resetTemplate(type);
  };

  const updateTemplate = (type: 'prd' | 'spec', value: string) => {
    if (type === 'prd') {
      setPrdTemplate(value);
    } else {
      setSpecTemplate(value);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const renderTemplateEditor = (type: 'prd' | 'spec') => {
    const isEditing = editMode[type];
    const template = type === 'prd' ? prdTemplate : specTemplate;
    const title = type === 'prd' ? 'PRD Template' : 'Technical Spec Template';
    const icon = type === 'prd' ? FileText : Code;
    const Icon = icon;

    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-primary" />
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {template.split('\n').length} lines
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyTemplate(type)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleResetTemplate(type)}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleEditMode(type)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSaveTemplate(type)}
                    className="bg-gradient-primary"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleEditMode(type)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 overflow-hidden">
          {isEditing ? (
            <Textarea
              value={template}
              onChange={(e) => updateTemplate(type, e.target.value)}
              className="h-full w-full font-mono text-sm resize-none border-0 rounded-none focus:ring-0 focus:ring-offset-0 p-6"
              placeholder={`Enter ${type.toUpperCase()} template...`}
            />
          ) : (
            <div className="h-full overflow-auto p-6">
              <pre className="whitespace-pre-wrap text-sm text-foreground bg-muted/30 p-4 rounded-lg min-h-full">
                {template}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0">
        <h1 className="text-3xl font-bold text-foreground">Document Templates</h1>
        <p className="text-muted-foreground mt-1">
          Customize the templates your AI teammate uses when creating PRDs and technical specifications
        </p>
      </div>

      {/* Templates */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="prd" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 max-w-md flex-shrink-0">
            <TabsTrigger value="prd" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              PRD Template
            </TabsTrigger>
            <TabsTrigger value="spec" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Spec Template
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-6 overflow-hidden">
            <TabsContent value="prd" className="h-full m-0">
              {renderTemplateEditor('prd')}
            </TabsContent>
            
            <TabsContent value="spec" className="h-full m-0">
              {renderTemplateEditor('spec')}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Help text */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Template Usage</p>
              <p>
                These templates are used by your AI teammate when creating new PRDs and technical specifications. 
                You can use placeholders like [Product Name] and [Feature Name] which will be replaced with actual values. 
                The AI will also adapt the content based on your conversation context.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}