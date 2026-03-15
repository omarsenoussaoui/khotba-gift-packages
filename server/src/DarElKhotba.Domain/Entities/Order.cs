using DarElKhotba.Domain.Enums;

namespace DarElKhotba.Domain.Entities;

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public int PackageId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string Wilaya { get; set; } = string.Empty;
    public string Commune { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int TotalPrice { get; set; }
    public int AdvanceAmount { get; set; }
    public int RemainingAmount { get; set; }
    public string? PaymentScreenshotUrl { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public string? AdminNotes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Package Package { get; set; } = null!;
}
