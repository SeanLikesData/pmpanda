import { useState } from "react";
import { Calendar, Plus, MoreVertical, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface RoadmapItem {
  id: string;
  name: string;
  status: "planned" | "in-progress" | "completed";
  priority: "P0" | "P1" | "P2" | "P3";
  quarter: string;
  description: string;
}

const mockRoadmapData: RoadmapItem[] = [
  {
    id: "1",
    name: "CLI Version of Olivie",
    status: "in-progress",
    priority: "P0",
    quarter: "Q1 2024",
    description: "Command-line interface for power users and automation"
  },
  {
    id: "2", 
    name: "Olivie for Browser",
    status: "planned",
    priority: "P1",
    quarter: "Q2 2024",
    description: "Browser extension for seamless web integration"
  },
  {
    id: "3",
    name: "API Integration Layer", 
    status: "planned",
    priority: "P2", 
    quarter: "Q2 2024",
    description: "Robust API for third-party integrations"
  },
  {
    id: "4",
    name: "Mobile App",
    status: "planned",
    priority: "P3",
    quarter: "Q3 2024", 
    description: "Native mobile experience for iOS and Android"
  }
];

export default function Roadmap() {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>(mockRoadmapData);

  const quarters = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success text-success-foreground";
      case "in-progress": return "bg-primary text-primary-foreground";
      case "planned": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P0": return "text-destructive font-bold"; // Critical - Red & Bold
      case "P1": return "text-warning font-semibold";  // High - Orange & Semi-bold  
      case "P2": return "text-primary font-medium";    // Medium - Blue & Medium
      case "P3": return "text-muted-foreground";       // Low - Muted
      default: return "text-muted-foreground";
    }
  };

  const movePriority = (id: string, direction: "up" | "down") => {
    // TODO: Implement priority reordering logic
    console.log(`Moving ${id} ${direction}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Roadmap</h1>
          <p className="text-muted-foreground mt-1">
            Strategic overview of all product initiatives and their timelines
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Initiative
        </Button>
      </div>

      {/* Roadmap by Quarters */}
      <div className="grid gap-6">
        {quarters.map((quarter) => {
          const quarterItems = roadmapItems.filter(item => item.quarter === quarter);
          
          return (
            <Card key={quarter} className="bg-gradient-card">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    {quarter}
                  </CardTitle>
                  <Badge variant="outline">
                    {quarterItems.length} initiative{quarterItems.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {quarterItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No initiatives planned for this quarter</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quarterItems.map((item) => (
                      <Card key={item.id} className="border border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-foreground">{item.name}</h3>
                                <Badge className={getStatusColor(item.status)} variant="secondary">
                                  {item.status.replace('-', ' ')}
                                </Badge>
                                <span className={`text-xs ${getPriorityColor(item.priority)}`}>
                                  {item.priority}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            
                            <div className="flex items-center gap-1 ml-4">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => movePriority(item.id, "up")}
                                className="h-8 w-8 p-0"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => movePriority(item.id, "down")}
                                className="h-8 w-8 p-0"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <MoreVertical className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit Initiative</DropdownMenuItem>
                                  <DropdownMenuItem>Change Quarter</DropdownMenuItem>
                                  <DropdownMenuItem>Update Status</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    Delete Initiative
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}