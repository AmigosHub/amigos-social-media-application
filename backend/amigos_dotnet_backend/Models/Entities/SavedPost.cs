using SocialMediaAdminBackend.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialMediaAdminBackend.Models.Entities;

[Table("saved_posts")]
public class SavedPost
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }

    [Column("post_id")]
    public long PostId { get; set; }

    [Column("saved_at")]
    public DateTime SavedAt { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }

    [ForeignKey("PostId")]
    public Post? Post { get; set; }
}