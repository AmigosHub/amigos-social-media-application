using Microsoft.EntityFrameworkCore;
using SocialMediaAdminBackend.Models.Entities;

namespace SocialMediaAdminBackend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Tables from your ER Diagram
    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Like> Likes { get; set; }
    public DbSet<Follow> Follows { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<Report> Reports { get; set; }
    public DbSet<SavedPost> SavedPosts { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<BlockedUser> BlockedUsers { get; set; }
    public DbSet<UserSettings> UserSettings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure table names to match your MySQL tables
        modelBuilder.Entity<User>().ToTable("users");
        modelBuilder.Entity<Post>().ToTable("posts");
        modelBuilder.Entity<Comment>().ToTable("comments");
        modelBuilder.Entity<Like>().ToTable("likes");
        modelBuilder.Entity<Follow>().ToTable("follows");
        modelBuilder.Entity<Message>().ToTable("messages");
        modelBuilder.Entity<Conversation>().ToTable("conversations");
        modelBuilder.Entity<Report>().ToTable("reports");
        modelBuilder.Entity<SavedPost>().ToTable("saved_posts");
        modelBuilder.Entity<Notification>().ToTable("notifications");
        modelBuilder.Entity<BlockedUser>().ToTable("blocked_users");
        modelBuilder.Entity<UserSettings>().ToTable("user_settings");

        // Configure relationships
        modelBuilder.Entity<Post>()
            .HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Post)
            .WithMany()
            .HasForeignKey(c => c.PostId);
    }
}