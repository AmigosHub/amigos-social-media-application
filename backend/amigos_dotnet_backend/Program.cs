

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using SocialMediaAdminBackend.Data;
using SocialMediaAdminBackend.Repositories;
using SocialMediaAdminBackend.Security;
using SocialMediaAdminBackend.Services.Implementations;
using SocialMediaAdminBackend.Services.Interfaces;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/adminapi-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// -------------------- CORS Configuration --------------------
// Add CORS policy to allow React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",      // React default
                "http://localhost:5173",      // Vite default
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5173",
                "https://social-app-test-coral.vercel.app"
            )
            .AllowAnyMethod()                  // GET, POST, PUT, PATCH, DELETE, OPTIONS
            .AllowAnyHeader()                  // Authorization, Content-Type, etc.
            .AllowCredentials()                // Allow cookies, authorization headers
            .SetPreflightMaxAge(TimeSpan.FromSeconds(3600)); // Cache preflight for 1 hour
    });
});
// -----------------------------------------------------------

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger/OpenAPI
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Social Media Admin API",
        Version = "v1",
        Description = "Admin Panel API for Social Media Application"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// MySQL Database Connection
//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//    options.UseMySql(
//        builder.Configuration.GetConnectionString("DefaultConnection"),
//        new MySqlServerVersion(new Version(8, 0, 0))
//    ));
var connectionString =
    Environment.GetEnvironmentVariable("DB_CONNECTION")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        connectionString,
        new MySqlServerVersion(new Version(8, 0, 0))
    ));

// JWT Authentication - Base64 Decoding
//var jwtSettings = builder.Configuration.GetSection("Jwt");
//var secretKeyValue = jwtSettings["SecretKey"] ?? "";

var secretKeyValue =
    Environment.GetEnvironmentVariable("JWT_SECRET")
    ?? builder.Configuration["Jwt:SecretKey"]
    ?? "";

// CRITICAL: Decode the Base64 key
byte[] secretKeyBytes;
try
{
    // The key is Base64 encoded, so decode it first
    secretKeyBytes = Convert.FromBase64String(secretKeyValue);
    Console.WriteLine($"✅ Key decoded from Base64. Length: {secretKeyBytes.Length} bytes");
}
catch (FormatException)
{
    // If not Base64, use UTF8 bytes
    secretKeyBytes = Encoding.UTF8.GetBytes(secretKeyValue);
    Console.WriteLine($"⚠️ Key used as UTF8. Length: {secretKeyBytes.Length} bytes");
}

// Ensure key is at least 32 bytes
if (secretKeyBytes.Length < 32)
{
    Console.WriteLine($"❌ Key is only {secretKeyBytes.Length} bytes! Minimum is 32 bytes for HS256.");
    throw new Exception("JWT secret key must be at least 32 bytes (256 bits) for HS256");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(secretKeyBytes),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogError("❌ Authentication failed: {Exception}", context.Exception.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                var role = context.Principal?.FindFirst("user_role")?.Value;
                logger.LogInformation($"✅ Token validated successfully. Role: {role}");
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogWarning("⚠️ Challenge: {Error}", context.Error);
                return Task.CompletedTask;
            }
        };
    });

// Register Security Services
builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<AdminAuthorizationFilter>();

// Register Repositories
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<ReportRepository>();

// Register Services
builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();
builder.Services.AddScoped<IAdminUserService, AdminUserService>();
builder.Services.AddScoped<IAdminReportService, AdminReportService>();
builder.Services.AddScoped<IAdminAnalyticsService, AdminAnalyticsService>();

// HTTP Client for Java API
builder.Services.AddHttpClient("JavaApi", client =>
{
    //client.BaseAddress = new Uri(builder.Configuration["JavaApi:BaseUrl"] ?? "http://localhost:8080");

    var javaApiUrl =
    Environment.GetEnvironmentVariable("JAVA_API_URL")
    ?? builder.Configuration["JavaApi:BaseUrl"]
    ?? "http://localhost:8080";

    client.BaseAddress = new Uri(javaApiUrl);

    client.Timeout = TimeSpan.FromSeconds(builder.Configuration.GetValue<int>("JavaApi:TimeoutSeconds", 30));
});

// Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireClaim("user_role", "ADMIN"));
});

var app = builder.Build();

// Configure pipeline
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Social Media Admin API V1");
    c.RoutePrefix = "swagger";
});

// -------------------- Use CORS --------------------
// IMPORTANT: UseCors MUST be called before UseAuthentication and UseAuthorization
app.UseCors("AllowReactApp");  // Apply the CORS policy
// ------------------------------------------------

// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();