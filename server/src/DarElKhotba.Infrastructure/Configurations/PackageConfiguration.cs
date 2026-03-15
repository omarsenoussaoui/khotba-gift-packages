using DarElKhotba.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DarElKhotba.Infrastructure.Configurations;

public class PackageConfiguration : IEntityTypeConfiguration<Package>
{
    public void Configure(EntityTypeBuilder<Package> builder)
    {
        builder.HasKey(p => p.Id);
        builder.HasIndex(p => p.Slug).IsUnique();
        builder.Property(p => p.NameFr).IsRequired().HasMaxLength(200);
        builder.Property(p => p.NameAr).IsRequired().HasMaxLength(200);
        builder.Property(p => p.Slug).IsRequired().HasMaxLength(200);
        builder.Property(p => p.DescriptionFr).IsRequired();
        builder.Property(p => p.DescriptionAr).IsRequired();
        builder.Property(p => p.ItemsFr).IsRequired();
        builder.Property(p => p.ItemsAr).IsRequired();
        builder.Property(p => p.Tier).IsRequired();
        builder.Property(p => p.Price).IsRequired();
    }
}
