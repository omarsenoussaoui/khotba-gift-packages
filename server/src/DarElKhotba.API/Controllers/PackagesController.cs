using DarElKhotba.Application.DTOs;
using DarElKhotba.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DarElKhotba.API.Controllers;

[ApiController]
[Route("api/packages")]
public class PackagesController : ControllerBase
{
    private readonly IPackageService _packageService;

    public PackagesController(IPackageService packageService) => _packageService = packageService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var packages = await _packageService.GetAllActiveAsync();
        return Ok(ApiResponse<IEnumerable<PackageDto>>.Ok(packages));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var pkg = await _packageService.GetByIdAsync(id);
        if (pkg is null || !pkg.IsActive)
            return NotFound(ApiResponse<PackageDto>.Fail("Package not found."));
        return Ok(ApiResponse<PackageDto>.Ok(pkg));
    }

    [HttpGet("by-slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var pkg = await _packageService.GetBySlugAsync(slug);
        if (pkg is null || !pkg.IsActive)
            return NotFound(ApiResponse<PackageDto>.Fail("Package not found."));
        return Ok(ApiResponse<PackageDto>.Ok(pkg));
    }
}
