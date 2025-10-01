import { useState } from "react";
import { User, Building, Mail, Save, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";

export default function Profile() {
  const { profile, preferences, loading, updateProfile, updatePreferences } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    company: '',
    department: '',
    bio: ''
  });
  const [prefsData, setPrefsData] = useState({
    prd_template_style: '',
    spec_template_style: '',
    communication_style: ''
  });

  // Update form data when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        role: profile.role || '',
        company: profile.company || '',
        department: profile.department || '',
        bio: profile.bio || ''
      });
    }
    if (preferences) {
      setPrefsData({
        prd_template_style: preferences.prd_template_style || '',
        spec_template_style: preferences.spec_template_style || '',
        communication_style: preferences.communication_style || ''
      });
    }
  });

  const handleSave = async () => {
    await updateProfile(formData);
    await updatePreferences(prefsData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field: string, value: string) => {
    setPrefsData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and AI assistant preferences
          </p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={isEditing ? "bg-gradient-primary" : ""}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Summary */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-lg bg-gradient-primary text-white">
                {formData.name ? formData.name.split(' ').map(n => n[0]).join('') : 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-semibold text-lg">{formData.name || 'Your Name'}</h3>
              <p className="text-muted-foreground">{formData.role || 'Your Role'}</p>
              <p className="text-sm text-muted-foreground">{formData.company || 'Your Company'}</p>
            </div>

            <div className="pt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                {formData.email || 'your@email.com'}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="w-4 h-4" />
                {formData.department || 'Your Department'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                rows={4}
                placeholder="Tell us about your role and experience..."
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant Preferences */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>AI Assistant Preferences</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure how your AI teammate should interact with you and structure documents
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="prd-template">Preferred PRD Style</Label>
                <Input
                  id="prd-template"
                  value={prefsData.prd_template_style}
                  onChange={(e) => handlePreferenceChange('prd_template_style', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., lean-startup, detailed, agile"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spec-template">Preferred Spec Style</Label>
                <Input
                  id="spec-template"
                  value={prefsData.spec_template_style}
                  onChange={(e) => handlePreferenceChange('spec_template_style', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., technical-detailed, high-level, visual"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="communication-style">Communication Style</Label>
                <Input
                  id="communication-style"
                  value={prefsData.communication_style}
                  onChange={(e) => handlePreferenceChange('communication_style', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., concise, detailed, collaborative"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}