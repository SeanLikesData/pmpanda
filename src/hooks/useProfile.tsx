import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  name: string | null;
  email: string | null;
  role: string | null;
  company: string | null;
  department: string | null;
  bio: string | null;
  avatar_url: string | null;
}

interface Preferences {
  prd_template_style: string | null;
  spec_template_style: string | null;
  communication_style: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPreferences();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchPreferences = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setPreferences(data);
    } else if (!data) {
      // Create default preferences
      const { data: newPrefs } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          prd_template_style: 'lean-startup',
          spec_template_style: 'technical-detailed',
          communication_style: 'concise'
        })
        .select()
        .single();
      
      if (newPrefs) {
        setPreferences(newPrefs);
      }
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully."
      });
    }
  };

  const updatePreferences = async (updates: Partial<Preferences>) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error updating preferences",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setPreferences(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  return {
    profile,
    preferences,
    loading,
    updateProfile,
    updatePreferences
  };
}
