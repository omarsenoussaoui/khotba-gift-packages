using DarElKhotba.Domain.Entities;
using DarElKhotba.Domain.Interfaces;
using DarElKhotba.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DarElKhotba.Infrastructure.Repositories;

public class PackageRepository : IPackageRepository
{
    private readonly AppDbContext _db;

    public PackageRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<Package>> GetAllActiveAsync() =>
        await _db.Packages.Where(p => p.IsActive).OrderBy(p => p.Tier).ToListAsync();

    public async Task<IEnumerable<Package>> GetAllAsync() =>
        await _db.Packages.OrderBy(p => p.Tier).ToListAsync();

    public async Task<Package?> GetByIdAsync(int id) =>
        await _db.Packages.FindAsync(id);

    public async Task<Package?> GetBySlugAsync(string slug) =>
        await _db.Packages.FirstOrDefaultAsync(p => p.Slug == slug);

    public async Task<Package> CreateAsync(Package package)
    {
        _db.Packages.Add(package);
        await _db.SaveChangesAsync();
        return package;
    }

    public async Task<Package> UpdateAsync(Package package)
    {
        _db.Packages.Update(package);
        await _db.SaveChangesAsync();
        return package;
    }

    public async Task<bool> HasOrdersAsync(int packageId) =>
        await _db.Orders.AnyAsync(o => o.PackageId == packageId);

    public async Task DeleteAsync(int id)
    {
        var package = await _db.Packages.FindAsync(id);
        if (package is not null)
        {
            _db.Packages.Remove(package);
            await _db.SaveChangesAsync();
        }
    }
}
