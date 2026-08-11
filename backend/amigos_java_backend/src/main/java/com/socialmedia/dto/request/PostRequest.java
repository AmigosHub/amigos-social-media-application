package com.socialmedia.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class PostRequest {

    @Size(max = 5000, message = "Content cannot exceed 5000 characters")
    private String content;

    private MultipartFile media;
}