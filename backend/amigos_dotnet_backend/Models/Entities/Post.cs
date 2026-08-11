using SocialMediaAdminBackend.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialMediaAdminBackend.Models.Entities;

[Table("posts")]
public class Post
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }

    [Column("content")]
    public string? Content { get; set; }

    [Column("media_url")]
    public string? MediaUrl { get; set; }

    [Column("media_type")]
    public string? MediaType { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }
}