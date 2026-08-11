using SocialMediaAdminBackend.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialMediaAdminBackend.Models.Entities;

[Table("follows")]
public class Follow
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("follower_id")]
    public long FollowerId { get; set; }

    [Column("following_id")]
    public long FollowingId { get; set; }

    [Column("status")]
    public string Status { get; set; } = "PENDING";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [ForeignKey("FollowerId")]
    public User? Follower { get; set; }

    [ForeignKey("FollowingId")]
    public User? Following { get; set; }
}