using System.Text.Json;
using DarElKhotba.Application.DTOs;
using DarElKhotba.Application.Interfaces;
using DarElKhotba.Domain.Entities;
using DarElKhotba.Domain.Enums;
using DarElKhotba.Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace DarElKhotba.Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepo;
    private readonly IPackageRepository _packageRepo;
    private readonly IFileStorageService _fileStorage;

    public OrderService(IOrderRepository orderRepo, IPackageRepository packageRepo, IFileStorageService fileStorage)
    {
        _orderRepo = orderRepo;
        _packageRepo = packageRepo;
        _fileStorage = fileStorage;
    }

    public async Task<OrderDto> CreateAsync(CreateOrderDto dto, IFormFile? screenshot)
    {
        var package = await _packageRepo.GetByIdAsync(dto.PackageId)
            ?? throw new KeyNotFoundException("Package not found.");

        if (!package.IsActive)
            throw new InvalidOperationException("Package is not available.");

        string? screenshotUrl = null;
        if (screenshot is not null)
            screenshotUrl = await _fileStorage.SaveFileAsync(screenshot);

        var datePrefix = DateTime.UtcNow.ToString("yyyyMMdd");
        var seq = await _orderRepo.GetNextOrderSequenceAsync(datePrefix);
        var orderNumber = $"DK-{datePrefix}-{seq:D3}";

        var totalPrice = package.Price;
        var advanceAmount = (int)(totalPrice * 0.3);
        var remainingAmount = totalPrice - advanceAmount;

        var order = new Order
        {
            OrderNumber = orderNumber,
            PackageId = dto.PackageId,
            CustomerName = dto.CustomerName.Trim(),
            CustomerPhone = dto.CustomerPhone.Trim(),
            Wilaya = dto.Wilaya.Trim(),
            Commune = dto.Commune.Trim(),
            Address = dto.Address.Trim(),
            TotalPrice = totalPrice,
            AdvanceAmount = advanceAmount,
            RemainingAmount = remainingAmount,
            PaymentScreenshotUrl = screenshotUrl,
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        var created = await _orderRepo.CreateAsync(order);
        created.Package = package;

        return MapToOrderDto(created);
    }

    public async Task<OrderDto?> GetByOrderNumberAsync(string orderNumber)
    {
        var order = await _orderRepo.GetByOrderNumberAsync(orderNumber);
        return order is null ? null : MapToOrderDto(order);
    }

    public async Task<AdminOrderDto?> GetByIdAsync(int id)
    {
        var order = await _orderRepo.GetByIdAsync(id);
        return order is null ? null : MapToAdminOrderDto(order);
    }

    public async Task<(IEnumerable<OrderListDto> Orders, int TotalCount)> GetAllAsync(
        OrderStatus? status, string? wilaya, string? search, int page, int limit)
    {
        var (orders, totalCount) = await _orderRepo.GetAllAsync(status, wilaya, search, page, limit);
        return (orders.Select(MapToOrderListDto), totalCount);
    }

    public async Task UpdateStatusAsync(int id, string statusStr)
    {
        var order = await _orderRepo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Order not found.");

        if (!Enum.TryParse<OrderStatus>(statusStr, true, out var newStatus))
            throw new ArgumentException($"Invalid status: {statusStr}");

        ValidateStatusTransition(order.Status, newStatus);

        order.Status = newStatus;
        order.UpdatedAt = DateTime.UtcNow;
        await _orderRepo.UpdateAsync(order);
    }

    public async Task UpdateNotesAsync(int id, string notes)
    {
        var order = await _orderRepo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Order not found.");

        order.AdminNotes = notes;
        order.UpdatedAt = DateTime.UtcNow;
        await _orderRepo.UpdateAsync(order);
    }

    public async Task<OrderStatsDto> GetStatsAsync()
    {
        var statusCounts = await _orderRepo.GetCountByStatusAsync();
        var popularPackages = await _orderRepo.GetPopularPackagesAsync();

        var (recentOrders, _) = await _orderRepo.GetAllAsync(page: 1, limit: 10);

        return new OrderStatsDto
        {
            TotalOrders = await _orderRepo.GetTotalCountAsync(),
            OrdersToday = await _orderRepo.GetCountTodayAsync(),
            OrdersThisMonth = await _orderRepo.GetCountThisMonthAsync(),
            RevenueTotal = await _orderRepo.GetRevenueTotalAsync(),
            RevenueThisMonth = await _orderRepo.GetRevenueThisMonthAsync(),
            OrdersByStatus = statusCounts.ToDictionary(x => x.Key.ToString(), x => x.Value),
            PopularPackages = popularPackages.Select(x => new PopularPackageDto
            {
                PackageName = x.PackageName,
                OrderCount = x.OrderCount
            }).ToList(),
            RecentOrders = recentOrders.Select(MapToOrderListDto).ToList(),
        };
    }

    private static void ValidateStatusTransition(OrderStatus current, OrderStatus next)
    {
        var validTransitions = new Dictionary<OrderStatus, OrderStatus[]>
        {
            [OrderStatus.Pending] = [OrderStatus.PaymentVerified, OrderStatus.Cancelled],
            [OrderStatus.PaymentVerified] = [OrderStatus.Confirmed, OrderStatus.Cancelled],
            [OrderStatus.Confirmed] = [OrderStatus.Preparing, OrderStatus.Cancelled],
            [OrderStatus.Preparing] = [OrderStatus.Shipped, OrderStatus.Cancelled],
            [OrderStatus.Shipped] = [OrderStatus.Delivered],
            [OrderStatus.Delivered] = [],
            [OrderStatus.Cancelled] = [],
        };

        if (!validTransitions.TryGetValue(current, out var allowed) || !allowed.Contains(next))
            throw new InvalidOperationException(
                $"Cannot transition from {current} to {next}.");
    }

    private static OrderDto MapToOrderDto(Order o) => new()
    {
        OrderNumber = o.OrderNumber,
        PackageName = o.Package?.NameFr ?? "",
        TotalPrice = o.TotalPrice,
        AdvanceAmount = o.AdvanceAmount,
        RemainingAmount = o.RemainingAmount,
        Status = o.Status.ToString(),
        CreatedAt = o.CreatedAt,
    };

    private static AdminOrderDto MapToAdminOrderDto(Order o) => new()
    {
        Id = o.Id,
        OrderNumber = o.OrderNumber,
        PackageId = o.PackageId,
        PackageName = o.Package?.NameFr ?? "",
        PackageTier = o.Package?.Tier ?? 0,
        PackageItems = o.Package is not null
            ? JsonSerializer.Deserialize<string[]>(o.Package.ItemsFr) ?? []
            : [],
        CustomerName = o.CustomerName,
        CustomerPhone = o.CustomerPhone,
        Wilaya = o.Wilaya,
        Commune = o.Commune,
        Address = o.Address,
        TotalPrice = o.TotalPrice,
        AdvanceAmount = o.AdvanceAmount,
        RemainingAmount = o.RemainingAmount,
        PaymentScreenshotUrl = o.PaymentScreenshotUrl,
        Status = o.Status.ToString(),
        AdminNotes = o.AdminNotes,
        CreatedAt = o.CreatedAt,
        UpdatedAt = o.UpdatedAt,
    };

    private static OrderListDto MapToOrderListDto(Order o) => new()
    {
        Id = o.Id,
        OrderNumber = o.OrderNumber,
        CustomerName = o.CustomerName,
        CustomerPhone = o.CustomerPhone,
        PackageName = o.Package?.NameFr ?? "",
        Wilaya = o.Wilaya,
        TotalPrice = o.TotalPrice,
        Status = o.Status.ToString(),
        CreatedAt = o.CreatedAt,
    };
}
