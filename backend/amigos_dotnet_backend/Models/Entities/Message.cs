using SocialMediaAdminBackend.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialMediaAdminBackend.Models.Entities;

[Table("messages")]
public class Message
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("conversation_id")]
    public long ConversationId { get; set; }

    [Column("sender_id")]
    public long SenderId { get; set; }

    [Column("message_type")]
    public string MessageType { get; set; } = "TEXT";

    [Column("content")]
    public string? Content { get; set; }

    [Column("media_url")]
    public string? MediaUrl { get; set; }

    [Column("file_name")]
    public string? FileName { get; set; }

    [Column("file_size")]
    public long? FileSize { get; set; }

    [Column("is_read")]
    public bool IsRead { get; set; }

    [Column("read_at")]
    public DateTime? ReadAt { get; set; }

    [Column("reply_to_message_id")]
    public long? ReplyToMessageId { get; set; }

    [Column("is_deleted")]
    public bool IsDeleted { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("ConversationId")]
    public Conversation? Conversation { get; set; }

    [ForeignKey("SenderId")]
    public User? Sender { get; set; }
}