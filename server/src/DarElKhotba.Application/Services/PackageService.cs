using System.Text.Json;
using System.Text.RegularExpressions;
using DarElKhotba.Application.DTOs;
using DarElKhotba.Application.Interfaces;
using DarElKhotba.Domain.Entities;
using DarElKhotba.Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace DarElKhotba.Application.Services;

public partial class PackageService : IPackageService
{
    private readonly IPackageRepository _repo;
    private readonly IFileStorageService _fileStorage;

    public PackageService(IPackageRepository repo, IFileStorageService fileStorage)
    {
        _repo = repo;
        _fileStorage = fileStorage;
    }

    public async Task<IEnumerable<PackageDto>> GetAllActiveAsync()
    {
        var packages = await _repo.GetAllActiveAsync();
        return packages.Select(MapToDto);
    }

    public async Task<IEnumerable<PackageDto>> GetAllAsync()
    {
        var packages = await _repo.GetAllAsync();
        return packages.Select(MapToDto);
    }

    public async Task<PackageDto?> GetByIdAsync(int id)
    {
        var pkg = await _repo.GetByIdAsync(id);
        return pkg is null ? null : MapToDto(pkg);
    }

    public async Task<PackageDto?> GetBySlugAsync(string slug)
    {
        var pkg = await _repo.GetBySlugAsync(slug);
        return pkg is null ? null : MapToDto(pkg);
    }

    public async Task<PackageDto> CreateAsync(CreatePackageDto dto, IFormFile? image)
    {
        string? imageUrl = null;
        if (image is not null)
            imageUrl = await _fileStorage.SaveFileAsync(image);

        var slug = GenerateSlug(dto.NameFr);

        var package = new Package
        {
            Slug = slug,
            NameFr = dto.NameFr.Trim(),
            NameAr = dto.NameAr.Trim(),
            DescriptionFr = dto.DescriptionFr.Trim(),
            DescriptionAr = dto.DescriptionAr.Trim(),
            Price = dto.Price,
            ItemsFr = JsonSerializer.Serialize(dto.ItemsFr),
            ItemsAr = JsonSerializer.Serialize(dto.ItemsAr),
            ImageUrl = imageUrl,
            Tier = dto.Tier,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        var created = await _repo.CreateAsync(package);
        return MapToDto(created);
    }

    public async Task<PackageDto> UpdateAsync(int id, UpdatePackageDto dto, IFormFile? image)
    {
        var package = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Package with id {id} not found.");

        package.NameFr = dto.NameFr.Trim();
        package.NameAr = dto.NameAr.Trim();
        package.DescriptionFr = dto.DescriptionFr.Trim();
        package.DescriptionAr = dto.DescriptionAr.Trim();
        package.Price = dto.Price;
        package.ItemsFr = JsonSerializer.Serialize(dto.ItemsFr);
        package.ItemsAr = JsonSerializer.Serialize(dto.ItemsAr);
        package.Tier = dto.Tier;
        package.IsActive = dto.IsActive;
        package.UpdatedAt = DateTime.UtcNow;

        if (image is not null)
        {
            if (package.ImageUrl is not null)
                _fileStorage.DeleteFile(package.ImageUrl);
            package.ImageUrl = await _fileStorage.SaveFileAsync(image);
        }

        var updated = await _repo.UpdateAsync(package);
        return MapToDto(updated);
    }

    public async Task ToggleActiveAsync(int id)
    {
        var package = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Package with id {id} not found.");

        package.IsActive = !package.IsActive;
        package.UpdatedAt = DateTime.UtcNow;
        await _repo.UpdateAsync(package);
    }

    public async Task DeleteAsync(int id)
    {
        var package = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Package with id {id} not found.");

        if (await _repo.HasOrdersAsync(id))
        {
            package.IsActive = false;
            package.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateAsync(package);
        }
        else
        {
            await _repo.DeleteAsync(id);
        }
    }

    private static PackageDto MapToDto(Package p) => new()
    {
        Id = p.Id,
        Slug = p.Slug,
        NameFr = p.NameFr,
        NameAr = p.NameAr,
        DescriptionFr = p.DescriptionFr,
        DescriptionAr = p.DescriptionAr,
        Price = p.Price,
        ItemsFr = JsonSerializer.Deserialize<string[]>(p.ItemsFr) ?? [],
        ItemsAr = JsonSerializer.Deserialize<string[]>(p.ItemsAr) ?? [],
        ImageUrl = p.ImageUrl,
        Tier = p.Tier,
        IsActive = p.IsActive,
    };

    private static string GenerateSlug(string name)
    {
        var slug = name.ToLowerInvariant().Trim();
        slug = SlugSpaceRegex().Replace(slug, "-");
        slug = SlugInvalidRegex().Replace(slug, "");
        slug = SlugMultipleDashRegex().Replace(slug, "-");
        return slug.Trim('-');
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex SlugSpaceRegex();
    [GeneratedRegex(@"[^a-z0-9\-]")]
    private static partial Regex SlugInvalidRegex();
    [GeneratedRegex(@"-{2,}")]
    private static partial Regex SlugMultipleDashRegex();
}
