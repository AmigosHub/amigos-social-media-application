using SocialMediaAdminBackend.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialMediaAdminBackend.Models.Entities;

[Table("reports")]
public class Report
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("reporter_id")]
    public long ReporterId { get; set; }

    [Column("reported_user_id")]
    public long? ReportedUserId { get; set; }

    [Column("post_id")]
    public long? PostId { get; set; }

    [Column("comment_id")]
    public long? CommentId { get; set; }

    [Column("reason")]
    public string Reason { get; set; } = string.Empty;

    [Column("description")]
    public string? Description { get; set; }

    [Column("status")]
    public string Status { get; set; } = "PENDING";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    [ForeignKey("ReporterId")]
    public User? Reporter { get; set; }

    [ForeignKey("ReportedUserId")]
    public User? ReportedUser { get; set; }

    [ForeignKey("PostId")]
    public Post? Post { get; set; }

    [ForeignKey("CommentId")]
    public Comment? Comment { get; set; }
}