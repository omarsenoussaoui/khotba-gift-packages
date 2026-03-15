using DarElKhotba.Domain.Enums;

namespace DarElKhotba.Application.DTOs;

public class OrderDto
{
    public string OrderNumber { get; set; } = string.Empty;
    public string PackageName { get; set; } = string.Empty;
    public int TotalPrice { get; set; }
    public int AdvanceAmount { get; set; }
    public int RemainingAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class AdminOrderDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public int PackageId { get; set; }
    public string PackageName { get; set; } = string.Empty;
    public int PackageTier { get; set; }
    public string[] PackageItems { get; set; } = [];
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string Wilaya { get; set; } = string.Empty;
    public string Commune { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int TotalPrice { get; set; }
    public int AdvanceAmount { get; set; }
    public int RemainingAmount { get; set; }
    public string? PaymentScreenshotUrl { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? AdminNotes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class OrderListDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string PackageName { get; set; } = string.Empty;
    public string Wilaya { get; set; } = string.Empty;
    public int TotalPrice { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateOrderDto
{
    public int PackageId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string Wilaya { get; set; } = string.Empty;
    public string Commune { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}

public class UpdateOrderStatusDto
{
    public string Status { get; set; } = string.Empty;
}

public class UpdateOrderNotesDto
{
    public string AdminNotes { get; set; } = string.Empty;
}

public class OrderStatsDto
{
    public int TotalOrders { get; set; }
    public int OrdersToday { get; set; }
    public int OrdersThisMonth { get; set; }
    public int RevenueTotal { get; set; }
    public int RevenueThisMonth { get; set; }
    public Dictionary<string, int> OrdersByStatus { get; set; } = new();
    public List<PopularPackageDto> PopularPackages { get; set; } = new();
    public List<OrderListDto> RecentOrders { get; set; } = new();
}

public class PopularPackageDto
{
    public string PackageName { get; set; } = string.Empty;
    public int OrderCount { get; set; }
}
