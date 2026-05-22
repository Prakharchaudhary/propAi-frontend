'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService, leadService, dashboardService } from '@/lib/services';
import type { PropertyFilters, EnquiryFormData, Lead } from '@/lib/types';

export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyService.getAll(filters),
    staleTime: 60_000,
  });
}

export function useProperty(slug: string) {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: () => propertyService.getBySlug(slug),
    enabled: !!slug,
    staleTime: 60_000,
  });
}

export function usePropertyConfigurations() {
  return useQuery({
    queryKey: ['property-configurations'],
    queryFn: () => propertyService.getConfigurations(),
    staleTime: 300_000,
  });
}

export function usePropertyCities() {
  return useQuery({
    queryKey: ['property-cities'],
    queryFn: () => propertyService.getCities(),
    staleTime: 300_000,
  });
}

export function useSimilarProperties(id: string) {
  return useQuery({
    queryKey: ['similar-properties', id],
    queryFn: () => propertyService.getSimilar(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: propertyService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }),
  });
}

export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof propertyService.update>[1] }) =>
      propertyService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }),
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: propertyService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }),
  });
}

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: () => leadService.getAll(),
    staleTime: 30_000,
  });
}

export function useSubmitEnquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: EnquiryFormData) => leadService.submitEnquiry(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useUpdateLeadStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Lead['status'] }) =>
      leadService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 60_000,
  });
}

export function useLeadTrend() {
  return useQuery({
    queryKey: ['lead-trend'],
    queryFn: () => dashboardService.getLeadTrend(),
    staleTime: 120_000,
  });
}

export function useCityBreakdown() {
  return useQuery({
    queryKey: ['city-breakdown'],
    queryFn: () => dashboardService.getPropertyCityBreakdown(),
    staleTime: 120_000,
  });
}