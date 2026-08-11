using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialMediaAdminBackend.Models.Entities;

[Table("users")]
public class User
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("username")]
    public string Username { get; set; } = string.Empty;

    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Column("full_name")]
    public string FullName { get; set; } = string.Empty;

    [Column("bio")]
    public string? Bio { get; set; }

    [Column("profile_pic")]
    public string? ProfilePic { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; }

    [Column("is_private")]
    public bool IsPrivate { get; set; }

    [Column("role")]
    public string Role { get; set; } = "USER";

    [Column("last_seen")]
    public DateTime? LastSeen { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }
}