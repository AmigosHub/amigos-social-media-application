package com.socialmedia.repository;

import com.socialmedia.entity.Report;
import com.socialmedia.entity.User;
import com.socialmedia.common.enums.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {

    Page<Report> findByReporterOrderByCreatedAtDesc(User reporter, Pageable pageable);

    Page<Report> findByStatusOrderByCreatedAtDesc(ReportStatus status, Pageable pageable);

    boolean existsByReporterAndReportedUserAndStatus(User reporter, User reportedUser, ReportStatus status);
}