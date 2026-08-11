using SocialMediaAdminBackend.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialMediaAdminBackend.Models.Entities;

[Table("conversations")]
public class Conversation
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("user1_id")]
    public long User1Id { get; set; }

    [Column("user2_id")]
    public long User2Id { get; set; }

    [Column("last_message_at")]
    public DateTime? LastMessageAt { get; set; }

    [Column("is_archived")]
    public bool IsArchived { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("User1Id")]
    public User? User1 { get; set; }

    [ForeignKey("User2Id")]
    public User? User2 { get; set; }
}