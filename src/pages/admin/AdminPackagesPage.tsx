import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adminApi, type PackageApiDto } from '@/services/api';
import { Plus, Star } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function formatDA(amount: number) {
  return amount.toLocaleString('fr-FR') + ' DA';
}

const AdminPackagesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: packages = [], isLoading } = useQuery<PackageApiDto[]>({
    queryKey: ['admin', 'packages'],
    queryFn: adminApi.getPackages,
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => adminApi.togglePackage(id),
    onSuccess: () => {
      toast.success('Statut mis à jour');
      queryClient.invalidateQueries({ queryKey: ['admin', 'packages'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-serif text-gray-900">Coffrets</h1>
          <button
            onClick={() => navigate('/admin/packages/new')}
            className="flex items-center gap-2 px-4 py-2 bg-[hsl(42,65%,55%)] text-white text-sm font-medium rounded-lg hover:bg-[hsl(42,65%,50%)] transition-colors"
          >
            <Plus size={16} />
            Ajouter un coffret
          </button>
        </div>

        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Nom (FR)</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Nom (AR)</th>
                <th className="px-4 py-3 font-medium">Tier</th>
                <th className="px-4 py-3 font-medium">Prix</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Chargement...</td></tr>
              ) : packages.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Aucun coffret trouvé.</td></tr>
              ) : (
                packages.map((pkg: PackageApiDto) => (
                  <tr key={pkg.id} className="border-b last:border-0">
                    <td className="px-4 py-3 text-gray-500">{pkg.id}</td>
                    <td className="px-4 py-3 font-medium">{pkg.nameFr}</td>
                    <td className="px-4 py-3 hidden md:table-cell" dir="rtl">{pkg.nameAr}</td>
                    <td className="px-4 py-3">
                      <span className="flex gap-0.5">
                        {Array.from({ length: pkg.tier }).map((_, i) => (
                          <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                        ))}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums font-medium">{formatDA(pkg.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {pkg.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/packages/${pkg.id}/edit`)}
                          className="text-xs px-3 py-1.5 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                          Modifier
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="text-xs px-3 py-1.5 rounded-lg border hover:bg-gray-50 transition-colors">
                              {pkg.isActive ? 'Désactiver' : 'Activer'}
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer</AlertDialogTitle>
                              <AlertDialogDescription>
                                Voulez-vous {pkg.isActive ? 'désactiver' : 'activer'} le coffret "{pkg.nameFr}" ?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => toggleMutation.mutate(pkg.id)}>
                                Confirmer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPackagesPage;
