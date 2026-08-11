using SocialMediaAdminBackend.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialMediaAdminBackend.Models.Entities;

[Table("blocked_users")]
public class BlockedUser
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("blocker_id")]
    public long BlockerId { get; set; }

    [Column("blocked_user_id")]
    public long BlockedUserId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [ForeignKey("BlockerId")]
    public User? Blocker { get; set; }

    [ForeignKey("BlockedUserId")]
    public User? BlockedUserEntity { get; set; }
}