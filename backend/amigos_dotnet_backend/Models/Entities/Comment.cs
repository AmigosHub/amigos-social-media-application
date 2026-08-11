using SocialMediaAdminBackend.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialMediaAdminBackend.Models.Entities;

[Table("comments")]
public class Comment
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("post_id")]
    public long PostId { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }

    [Column("content")]
    public string Content { get; set; } = string.Empty;

    [Column("parent_id")]
    public long? ParentId { get; set; }

    [Column("is_edited")]
    public bool IsEdited { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("PostId")]
    public Post? Post { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }
}