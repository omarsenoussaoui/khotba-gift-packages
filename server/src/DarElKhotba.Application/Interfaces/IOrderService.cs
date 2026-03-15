using DarElKhotba.Application.DTOs;
using DarElKhotba.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace DarElKhotba.Application.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CreateAsync(CreateOrderDto dto, IFormFile? screenshot);
    Task<OrderDto?> GetByOrderNumberAsync(string orderNumber);
    Task<AdminOrderDto?> GetByIdAsync(int id);
    Task<(IEnumerable<OrderListDto> Orders, int TotalCount)> GetAllAsync(
        OrderStatus? status = null,
        string? wilaya = null,
        string? search = null,
        int page = 1,
        int limit = 20);
    Task UpdateStatusAsync(int id, string status);
    Task UpdateNotesAsync(int id, string notes);
    Task<OrderStatsDto> GetStatsAsync();
}
