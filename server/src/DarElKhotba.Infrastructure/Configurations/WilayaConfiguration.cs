using DarElKhotba.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DarElKhotba.Infrastructure.Configurations;

public class WilayaConfiguration : IEntityTypeConfiguration<Wilaya>
{
    public void Configure(EntityTypeBuilder<Wilaya> builder)
    {
        builder.HasKey(w => w.Id);
        builder.HasIndex(w => w.Code).IsUnique();
        builder.Property(w => w.Code).IsRequired().HasMaxLength(3);
        builder.Property(w => w.NameFr).IsRequired().HasMaxLength(100);
        builder.Property(w => w.NameAr).IsRequired().HasMaxLength(100);
    }
}
