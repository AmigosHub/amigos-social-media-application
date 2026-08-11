using SocialMediaAdminBackend.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialMediaAdminBackend.Models.Entities;

[Table("user_settings")]
public class UserSettings
{
    [Key]
    [Column("user_id")]
    public long UserId { get; set; }

    [Column("email_notifications")]
    public bool EmailNotifications { get; set; } = true;

    [Column("message_notifications")]
    public bool MessageNotifications { get; set; } = true;

    [Column("push_notifications")]
    public bool PushNotifications { get; set; } = true;

    [Column("account_visibility")]
    public string AccountVisibility { get; set; } = "PUBLIC";

    [Column("language")]
    public string Language { get; set; } = "en";

    [Column("theme")]
    public string Theme { get; set; } = "LIGHT";

    [ForeignKey("UserId")]
    public User? User { get; set; }
}