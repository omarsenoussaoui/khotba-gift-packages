using DarElKhotba.Domain.Entities;

namespace DarElKhotba.Domain.Interfaces;

public interface IPackageRepository
{
    Task<IEnumerable<Package>> GetAllActiveAsync();
    Task<IEnumerable<Package>> GetAllAsync();
    Task<Package?> GetByIdAsync(int id);
    Task<Package?> GetBySlugAsync(string slug);
    Task<Package> CreateAsync(Package package);
    Task<Package> UpdateAsync(Package package);
    Task<bool> HasOrdersAsync(int packageId);
    Task DeleteAsync(int id);
}
