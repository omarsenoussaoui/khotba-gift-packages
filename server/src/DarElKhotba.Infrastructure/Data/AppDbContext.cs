using DarElKhotba.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DarElKhotba.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Package> Packages => Set<Package>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Wilaya> Wilayas => Set<Wilaya>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
