import { useQuery } from '@tanstack/react-query';
import { packageApi, wilayaApi } from '@/services/api';

export const usePackages = () =>
  useQuery({
    queryKey: ['packages'],
    queryFn: packageApi.getAll,
    staleTime: 1000 * 60 * 5,
  });

export const usePackageBySlug = (slug: string) =>
  useQuery({
    queryKey: ['package', slug],
    queryFn: () => packageApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

export const useWilayas = () =>
  useQuery({
    queryKey: ['wilayas'],
    queryFn: wilayaApi.getAll,
    staleTime: 1000 * 60 * 30,
  });
