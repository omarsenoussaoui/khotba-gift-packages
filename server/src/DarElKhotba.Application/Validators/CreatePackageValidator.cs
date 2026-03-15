using DarElKhotba.Application.DTOs;

namespace DarElKhotba.Application.Validators;

public static class CreatePackageValidator
{
    public static List<string> Validate(CreatePackageDto dto)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(dto.NameFr))
            errors.Add("French name is required.");
        if (string.IsNullOrWhiteSpace(dto.NameAr))
            errors.Add("Arabic name is required.");
        if (string.IsNullOrWhiteSpace(dto.DescriptionFr))
            errors.Add("French description is required.");
        if (string.IsNullOrWhiteSpace(dto.DescriptionAr))
            errors.Add("Arabic description is required.");
        if (dto.Price < 1)
            errors.Add("Price must be at least 1.");
        if (dto.Tier < 1 || dto.Tier > 5)
            errors.Add("Tier must be between 1 and 5.");
        if (dto.ItemsFr.Length == 0)
            errors.Add("At least one French item is required.");
        if (dto.ItemsAr.Length == 0)
            errors.Add("At least one Arabic item is required.");

        return errors;
    }
}
