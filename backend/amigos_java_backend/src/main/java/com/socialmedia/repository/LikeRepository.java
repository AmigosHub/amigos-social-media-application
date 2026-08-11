package com.socialmedia.repository;

import com.socialmedia.entity.Like;
import com.socialmedia.entity.Post;
import com.socialmedia.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserAndPost(User user, Post post);

    boolean existsByUserAndPost(User user, Post post);

    void deleteByUserAndPost(User user, Post post);

    long countByPost(Post post);

    /**
     * Find all likes for a post with pagination, ordered by creation date descending
     * @param post The post to find likes for
     * @param pageable Pagination information
     * @return Page of likes
     */
    Page<Like> findByPostOrderByCreatedAtDesc(Post post, Pageable pageable);
}