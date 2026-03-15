using DarElKhotba.API.Middleware;
using DarElKhotba.Application.Interfaces;
using DarElKhotba.Application.Services;
using DarElKhotba.Domain.Interfaces;
using DarElKhotba.Infrastructure.Data;
using DarElKhotba.Infrastructure.Repositories;
using DarElKhotba.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories
builder.Services.AddScoped<IPackageRepository, PackageRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IWilayaRepository, WilayaRepository>();

// Services
builder.Services.AddScoped<IPackageService, PackageService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddSingleton<IFileStorageService>(sp =>
{
    var env = sp.GetRequiredService<IWebHostEnvironment>();
    return new LocalFileStorageService(env.WebRootPath);
});

// Controllers
builder.Services.AddControllers();

// CORS
var allowedOrigins = builder.Configuration["AllowedOrigins"]?.Split(',') ?? ["http://localhost:5173"];
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Seed database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DatabaseSeeder.SeedAsync(db);
}

// Ensure uploads directory exists
var uploadsPath = Path.Combine(app.Environment.WebRootPath, "uploads");
Directory.CreateDirectory(uploadsPath);

// Middleware — CORS must be first so preflight OPTIONS requests get handled
app.UseCors();
app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<AdminKeyAuthMiddleware>();
app.UseStaticFiles();
app.MapControllers();

app.Run();
