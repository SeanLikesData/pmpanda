import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface CompanyInfo {
  company_name: string | null;
  industry: string | null;
  size: string | null;
  mission: string | null;
  vision: string | null;
  target_customers: string | null;
  current_products: string | null;
  key_competitors: string | null;
  unique_value: string | null;
  business_goals: string | null;
  technical_stack: string | null;
  challenges: string | null;
}

export function useCompanyInfo() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCompanyInfo();
    }
  }, [user]);

  const fetchCompanyInfo = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setCompanyInfo(data);
    }
    setLoading(false);
  };

  const saveCompanyInfo = async (info: Partial<CompanyInfo>) => {
    if (!user) return;

    // Check if company info exists
    const { data: existing } = await supabase
      .from('company_info')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('company_info')
        .update(info)
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Error saving company info",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setCompanyInfo(prev => prev ? { ...prev, ...info } : null);
        toast({
          title: "Company information saved!",
          description: "Your company details have been updated."
        });
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('company_info')
        .insert({
          user_id: user.id,
          ...info
        });

      if (error) {
        toast({
          title: "Error saving company info",
          description: error.message,
          variant: "destructive"
        });
      } else {
        await fetchCompanyInfo();
        toast({
          title: "Company information saved!",
          description: "Your company details have been created."
        });
      }
    }
  };

  return {
    companyInfo,
    loading,
    saveCompanyInfo
  };
}
