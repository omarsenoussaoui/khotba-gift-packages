using DarElKhotba.Domain.Entities;
using DarElKhotba.Domain.Interfaces;
using DarElKhotba.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DarElKhotba.Infrastructure.Repositories;

public class WilayaRepository : IWilayaRepository
{
    private readonly AppDbContext _db;

    public WilayaRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<Wilaya>> GetAllAsync() =>
        await _db.Wilayas.OrderBy(w => w.Code).ToListAsync();
}
