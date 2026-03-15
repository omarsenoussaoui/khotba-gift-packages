using DarElKhotba.Application.DTOs;
using Microsoft.AspNetCore.Http;

namespace DarElKhotba.Application.Interfaces;

public interface IPackageService
{
    Task<IEnumerable<PackageDto>> GetAllActiveAsync();
    Task<IEnumerable<PackageDto>> GetAllAsync();
    Task<PackageDto?> GetByIdAsync(int id);
    Task<PackageDto?> GetBySlugAsync(string slug);
    Task<PackageDto> CreateAsync(CreatePackageDto dto, IFormFile? image);
    Task<PackageDto> UpdateAsync(int id, UpdatePackageDto dto, IFormFile? image);
    Task ToggleActiveAsync(int id);
    Task DeleteAsync(int id);
}
