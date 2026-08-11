using SocialMediaAdminBackend.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialMediaAdminBackend.Models.Entities;

[Table("notifications")]
public class Notification
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("receiver_id")]
    public long ReceiverId { get; set; }

    [Column("sender_id")]
    public long? SenderId { get; set; }

    [Column("post_id")]
    public long? PostId { get; set; }

    [Column("comment_id")]
    public long? CommentId { get; set; }

    [Column("notification_type")]
    public string NotificationType { get; set; } = string.Empty;

    [Column("message")]
    public string? Message { get; set; }

    [Column("is_read")]
    public bool IsRead { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [ForeignKey("ReceiverId")]
    public User? Receiver { get; set; }

    [ForeignKey("SenderId")]
    public User? Sender { get; set; }
}