using DarElKhotba.Domain.Entities;
using DarElKhotba.Domain.Enums;
using DarElKhotba.Domain.Interfaces;
using DarElKhotba.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DarElKhotba.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _db;

    public OrderRepository(AppDbContext db) => _db = db;

    public async Task<Order> CreateAsync(Order order)
    {
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        return order;
    }

    public async Task<Order?> GetByOrderNumberAsync(string orderNumber) =>
        await _db.Orders.Include(o => o.Package)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);

    public async Task<Order?> GetByIdAsync(int id) =>
        await _db.Orders.Include(o => o.Package)
            .FirstOrDefaultAsync(o => o.Id == id);

    public async Task<(IEnumerable<Order> Orders, int TotalCount)> GetAllAsync(
        OrderStatus? status, string? wilaya, string? search, int page, int limit)
    {
        var query = _db.Orders.Include(o => o.Package).AsQueryable();

        if (status.HasValue)
            query = query.Where(o => o.Status == status.Value);

        if (!string.IsNullOrWhiteSpace(wilaya))
            query = query.Where(o => o.Wilaya == wilaya);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(o =>
                o.OrderNumber.ToLower().Contains(s) ||
                o.CustomerName.ToLower().Contains(s) ||
                o.CustomerPhone.Contains(s));
        }

        var totalCount = await query.CountAsync();

        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        return (orders, totalCount);
    }

    public async Task<Order> UpdateAsync(Order order)
    {
        _db.Orders.Update(order);
        await _db.SaveChangesAsync();
        return order;
    }

    public async Task<int> GetTotalCountAsync() =>
        await _db.Orders.CountAsync();

    public async Task<int> GetCountTodayAsync()
    {
        var today = DateTime.UtcNow.Date;
        return await _db.Orders.CountAsync(o => o.CreatedAt >= today);
    }

    public async Task<int> GetCountThisMonthAsync()
    {
        var firstOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
        return await _db.Orders.CountAsync(o => o.CreatedAt >= firstOfMonth);
    }

    public async Task<int> GetRevenueTotalAsync() =>
        await _db.Orders.Where(o => o.Status == OrderStatus.Delivered)
            .SumAsync(o => o.TotalPrice);

    public async Task<int> GetRevenueThisMonthAsync()
    {
        var firstOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
        return await _db.Orders
            .Where(o => o.Status == OrderStatus.Delivered && o.CreatedAt >= firstOfMonth)
            .SumAsync(o => o.TotalPrice);
    }

    public async Task<Dictionary<OrderStatus, int>> GetCountByStatusAsync()
    {
        var counts = await _db.Orders
            .GroupBy(o => o.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();

        var result = new Dictionary<OrderStatus, int>();
        foreach (var s in Enum.GetValues<OrderStatus>())
            result[s] = counts.FirstOrDefault(c => c.Status == s)?.Count ?? 0;

        return result;
    }

    public async Task<IEnumerable<(string PackageName, int OrderCount)>> GetPopularPackagesAsync()
    {
        var result = await _db.Orders
            .Include(o => o.Package)
            .GroupBy(o => o.Package.NameFr)
            .Select(g => new { PackageName = g.Key, OrderCount = g.Count() })
            .OrderByDescending(x => x.OrderCount)
            .Take(5)
            .ToListAsync();

        return result.Select(x => (x.PackageName, x.OrderCount));
    }

    public async Task<int> GetNextOrderSequenceAsync(string datePrefix)
    {
        var prefix = $"DK-{datePrefix}-";
        var lastOrder = await _db.Orders
            .Where(o => o.OrderNumber.StartsWith(prefix))
            .OrderByDescending(o => o.OrderNumber)
            .FirstOrDefaultAsync();

        if (lastOrder is null)
            return 1;

        var lastSeq = int.Parse(lastOrder.OrderNumber[prefix.Length..]);
        return lastSeq + 1;
    }
}
