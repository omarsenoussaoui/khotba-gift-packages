using DarElKhotba.Application.DTOs;
using DarElKhotba.Application.Interfaces;
using DarElKhotba.Application.Validators;
using DarElKhotba.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace DarElKhotba.API.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IPackageService _packageService;

    public AdminController(IOrderService orderService, IPackageService packageService)
    {
        _orderService = orderService;
        _packageService = packageService;
    }

    // --- Stats ---
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _orderService.GetStatsAsync();
        return Ok(ApiResponse<OrderStatsDto>.Ok(stats));
    }

    // --- Orders ---
    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders(
        [FromQuery] string? status,
        [FromQuery] string? wilaya,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20)
    {
        OrderStatus? statusEnum = null;
        if (!string.IsNullOrEmpty(status) && Enum.TryParse<OrderStatus>(status, true, out var parsed))
            statusEnum = parsed;

        var (orders, totalCount) = await _orderService.GetAllAsync(statusEnum, wilaya, search, page, limit);
        return Ok(new ApiResponse<IEnumerable<OrderListDto>>
        {
            Success = true,
            Data = orders,
            TotalCount = totalCount,
        });
    }

    [HttpGet("orders/{id:int}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var order = await _orderService.GetByIdAsync(id);
        if (order is null)
            return NotFound(ApiResponse<AdminOrderDto>.Fail("Order not found."));
        return Ok(ApiResponse<AdminOrderDto>.Ok(order));
    }

    [HttpPatch("orders/{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        await _orderService.UpdateStatusAsync(id, dto.Status);
        return Ok(new ApiResponse<object> { Success = true });
    }

    [HttpPatch("orders/{id:int}/notes")]
    public async Task<IActionResult> UpdateNotes(int id, [FromBody] UpdateOrderNotesDto dto)
    {
        await _orderService.UpdateNotesAsync(id, dto.AdminNotes);
        return Ok(new ApiResponse<object> { Success = true });
    }

    // --- Packages ---
    [HttpGet("packages")]
    public async Task<IActionResult> GetPackages()
    {
        var packages = await _packageService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<PackageDto>>.Ok(packages));
    }

    [HttpPost("packages")]
    public async Task<IActionResult> CreatePackage([FromForm] CreatePackageDto dto, IFormFile? image)
    {
        var errors = CreatePackageValidator.Validate(dto);
        if (errors.Count > 0)
            return BadRequest(ApiResponse<object>.Fail(string.Join(" ", errors)));

        var pkg = await _packageService.CreateAsync(dto, image);
        return Created($"/api/packages/{pkg.Id}", ApiResponse<PackageDto>.Ok(pkg));
    }

    [HttpPut("packages/{id:int}")]
    public async Task<IActionResult> UpdatePackage(int id, [FromForm] UpdatePackageDto dto, IFormFile? image)
    {
        var pkg = await _packageService.UpdateAsync(id, dto, image);
        return Ok(ApiResponse<PackageDto>.Ok(pkg));
    }

    [HttpPatch("packages/{id:int}/toggle")]
    public async Task<IActionResult> TogglePackage(int id)
    {
        await _packageService.ToggleActiveAsync(id);
        return Ok(new ApiResponse<object> { Success = true });
    }

    [HttpDelete("packages/{id:int}")]
    public async Task<IActionResult> DeletePackage(int id)
    {
        await _packageService.DeleteAsync(id);
        return Ok(new ApiResponse<object> { Success = true });
    }
}
