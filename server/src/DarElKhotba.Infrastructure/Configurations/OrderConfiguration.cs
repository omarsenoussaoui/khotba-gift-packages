using DarElKhotba.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DarElKhotba.Infrastructure.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);
        builder.HasIndex(o => o.OrderNumber).IsUnique();
        builder.Property(o => o.OrderNumber).IsRequired().HasMaxLength(20);
        builder.Property(o => o.CustomerName).IsRequired().HasMaxLength(200);
        builder.Property(o => o.CustomerPhone).IsRequired().HasMaxLength(15);
        builder.Property(o => o.Wilaya).IsRequired().HasMaxLength(100);
        builder.Property(o => o.Commune).IsRequired().HasMaxLength(200);
        builder.Property(o => o.Address).IsRequired();
        builder.Property(o => o.Status).HasConversion<string>().HasMaxLength(20);

        builder.HasOne(o => o.Package)
            .WithMany(p => p.Orders)
            .HasForeignKey(o => o.PackageId);
    }
}
