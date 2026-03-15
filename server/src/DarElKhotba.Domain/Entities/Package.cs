namespace DarElKhotba.Domain.Entities;

public class Package
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string NameFr { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string DescriptionFr { get; set; } = string.Empty;
    public string DescriptionAr { get; set; } = string.Empty;
    public int Price { get; set; }
    public string ItemsFr { get; set; } = "[]";
    public string ItemsAr { get; set; } = "[]";
    public string? ImageUrl { get; set; }
    public int Tier { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
