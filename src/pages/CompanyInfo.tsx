import { useState, useEffect } from "react";
import { Building2, Save, Users, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";

export default function CompanyInfo() {
  const { companyInfo, loading, saveCompanyInfo } = useCompanyInfo();
  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    size: "",
    mission: "",
    vision: "",
    target_customers: "",
    current_products: "",
    key_competitors: "",
    unique_value: "",
    business_goals: "",
    technical_stack: "",
    challenges: ""
  });

  useEffect(() => {
    if (companyInfo) {
      setFormData({
        company_name: companyInfo.company_name || "",
        industry: companyInfo.industry || "",
        size: companyInfo.size || "",
        mission: companyInfo.mission || "",
        vision: companyInfo.vision || "",
        target_customers: companyInfo.target_customers || "",
        current_products: companyInfo.current_products || "",
        key_competitors: companyInfo.key_competitors || "",
        unique_value: companyInfo.unique_value || "",
        business_goals: companyInfo.business_goals || "",
        technical_stack: companyInfo.technical_stack || "",
        challenges: companyInfo.challenges || ""
      });
    }
  }, [companyInfo]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    await saveCompanyInfo(formData);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-6 p-6 pb-16 md:pb-6">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Company Information</h2>
        </div>
        <p className="text-muted-foreground">
          Provide details about your company and products to help the AI give you better recommendations and insights.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Basic Company Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Tell us about your company's fundamental details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  placeholder="e.g., Acme Corporation"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., SaaS, E-commerce, FinTech"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              <Input
                id="size"
                placeholder="e.g., 10-50 employees, Startup, Enterprise"
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Mission & Vision
            </CardTitle>
            <CardDescription>
              Your company's purpose and aspirations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mission">Mission Statement</Label>
              <Textarea
                id="mission"
                placeholder="What is your company's core purpose and reason for existence?"
                value={formData.mission}
                onChange={(e) => handleInputChange('mission', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vision">Vision Statement</Label>
              <Textarea
                id="vision"
                placeholder="Where do you see your company in the future?"
                value={formData.vision}
                onChange={(e) => handleInputChange('vision', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Target Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Target Customers
            </CardTitle>
            <CardDescription>
              Who are your primary customers and users?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="target_customers">Customer Description</Label>
              <Textarea
                id="target_customers"
                placeholder="Describe your target customers: demographics, needs, pain points, behaviors..."
                value={formData.target_customers}
                onChange={(e) => handleInputChange('target_customers', e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Products & Market */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Products & Market Position
            </CardTitle>
            <CardDescription>
              Your current products and competitive landscape
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_products">Current Products/Services</Label>
              <Textarea
                id="current_products"
                placeholder="List and describe your existing products or services..."
                value={formData.current_products}
                onChange={(e) => handleInputChange('current_products', e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="key_competitors">Key Competitors</Label>
              <Textarea
                id="key_competitors"
                placeholder="Who are your main competitors and how do you differentiate?"
                value={formData.key_competitors}
                onChange={(e) => handleInputChange('key_competitors', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unique_value">Unique Value Proposition</Label>
              <Textarea
                id="unique_value"
                placeholder="What makes your company unique? What's your competitive advantage?"
                value={formData.unique_value}
                onChange={(e) => handleInputChange('unique_value', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Goals & Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>Strategic Context</CardTitle>
            <CardDescription>
              Goals, technical stack, and current challenges
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business_goals">Business Goals (Next 12 months)</Label>
              <Textarea
                id="business_goals"
                placeholder="What are your key business objectives and metrics you're trying to achieve?"
                value={formData.business_goals}
                onChange={(e) => handleInputChange('business_goals', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="technical_stack">Technical Stack</Label>
              <Textarea
                id="technical_stack"
                placeholder="What technologies, platforms, and tools does your company use? (e.g., React, AWS, Salesforce...)"
                value={formData.technical_stack}
                onChange={(e) => handleInputChange('technical_stack', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="challenges">Current Challenges</Label>
              <Textarea
                id="challenges"
                placeholder="What are the main challenges or pain points your company is facing?"
                value={formData.challenges}
                onChange={(e) => handleInputChange('challenges', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Company Information
        </Button>
      </div>
    </div>
  );
}