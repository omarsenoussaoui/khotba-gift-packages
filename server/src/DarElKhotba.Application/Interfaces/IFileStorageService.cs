using Microsoft.AspNetCore.Http;

namespace DarElKhotba.Application.Interfaces;

public interface IFileStorageService
{
    Task<string> SaveFileAsync(IFormFile file, string folder = "uploads");
    void DeleteFile(string filePath);
}
