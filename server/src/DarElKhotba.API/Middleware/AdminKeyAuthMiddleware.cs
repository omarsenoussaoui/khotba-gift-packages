namespace DarElKhotba.API.Middleware;

public class AdminKeyAuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly string _adminKey;

    public AdminKeyAuthMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _adminKey = configuration["AdminKey"] ?? throw new InvalidOperationException("AdminKey not configured.");
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/api/admin"))
        {
            if (!context.Request.Headers.TryGetValue("x-admin-key", out var key) || key != _adminKey)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync("{\"success\":false,\"error\":\"Unauthorized\"}");
                return;
            }
        }

        await _next(context);
    }
}
