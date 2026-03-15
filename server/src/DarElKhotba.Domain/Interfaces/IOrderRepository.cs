using DarElKhotba.Domain.Entities;
using DarElKhotba.Domain.Enums;

namespace DarElKhotba.Domain.Interfaces;

public interface IOrderRepository
{
    Task<Order> CreateAsync(Order order);
    Task<Order?> GetByOrderNumberAsync(string orderNumber);
    Task<Order?> GetByIdAsync(int id);
    Task<(IEnumerable<Order> Orders, int TotalCount)> GetAllAsync(
        OrderStatus? status = null,
        string? wilaya = null,
        string? search = null,
        int page = 1,
        int limit = 20);
    Task<Order> UpdateAsync(Order order);
    Task<int> GetTotalCountAsync();
    Task<int> GetCountTodayAsync();
    Task<int> GetCountThisMonthAsync();
    Task<int> GetRevenueTotalAsync();
    Task<int> GetRevenueThisMonthAsync();
    Task<Dictionary<OrderStatus, int>> GetCountByStatusAsync();
    Task<IEnumerable<(string PackageName, int OrderCount)>> GetPopularPackagesAsync();
    Task<int> GetNextOrderSequenceAsync(string datePrefix);
}
