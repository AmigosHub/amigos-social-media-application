namespace SocialMediaAdminBackend.Models.DTOs.Response;

public class PaginatedResponse<T>
{
    public List<T> Content { get; set; } = new();
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public long TotalElements { get; set; }
    public int TotalPages { get; set; }
    public bool IsLast { get; set; }
    public bool IsFirst { get; set; }
    public bool HasNext { get; set; }
    public bool HasPrevious { get; set; }

    public PaginatedResponse()
    {
    }

    public PaginatedResponse(List<T> content, int pageNumber, int pageSize, long totalElements)
    {
        Content = content;
        PageNumber = pageNumber;
        PageSize = pageSize;
        TotalElements = totalElements;
        TotalPages = (int)Math.Ceiling(totalElements / (double)pageSize);
        IsLast = pageNumber >= TotalPages - 1;
        IsFirst = pageNumber == 0;
        HasNext = pageNumber < TotalPages - 1;
        HasPrevious = pageNumber > 0;
    }
}