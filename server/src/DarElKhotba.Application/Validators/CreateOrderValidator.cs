using System.Text.RegularExpressions;
using DarElKhotba.Application.DTOs;

namespace DarElKhotba.Application.Validators;

public static partial class CreateOrderValidator
{
    public static List<string> Validate(CreateOrderDto dto)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(dto.CustomerName))
            errors.Add("Customer name is required.");
        else if (dto.CustomerName.Trim().Length < 3)
            errors.Add("Customer name must be at least 3 characters.");

        if (string.IsNullOrWhiteSpace(dto.CustomerPhone))
            errors.Add("Phone number is required.");
        else if (!PhoneRegex().IsMatch(dto.CustomerPhone.Trim()))
            errors.Add("Invalid Algerian phone number format.");

        if (string.IsNullOrWhiteSpace(dto.Wilaya))
            errors.Add("Wilaya is required.");

        if (string.IsNullOrWhiteSpace(dto.Commune))
            errors.Add("Commune is required.");

        if (string.IsNullOrWhiteSpace(dto.Address))
            errors.Add("Address is required.");
        else if (dto.Address.Trim().Length < 10)
            errors.Add("Address must be at least 10 characters.");

        if (dto.PackageId <= 0)
            errors.Add("Package is required.");

        return errors;
    }

    [GeneratedRegex(@"^0[567]\d{8}$")]
    private static partial Regex PhoneRegex();
}
