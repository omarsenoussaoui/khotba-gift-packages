using DarElKhotba.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace DarElKhotba.Infrastructure.Services;

public class LocalFileStorageService : IFileStorageService
{
    private readonly string _webRootPath;
    private static readonly HashSet<string> AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB

    public LocalFileStorageService(string webRootPath)
    {
        _webRootPath = webRootPath;
    }

    public async Task<string> SaveFileAsync(IFormFile file, string folder = "uploads")
    {
        if (file.Length > MaxFileSize)
            throw new InvalidOperationException("File size exceeds 5MB limit.");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            throw new InvalidOperationException($"File type '{ext}' is not allowed. Allowed: {string.Join(", ", AllowedExtensions)}");

        var uploadsDir = Path.Combine(_webRootPath, folder);
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return $"/{folder}/{fileName}";
    }

    public void DeleteFile(string filePath)
    {
        var fullPath = Path.Combine(_webRootPath, filePath.TrimStart('/'));
        if (File.Exists(fullPath))
            File.Delete(fullPath);
    }
}
