package com.ecosphere.repository;

import com.ecosphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import com.ecosphere.dto.LeaderboardDto;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT new com.ecosphere.dto.LeaderboardDto(u.id, u.name, CAST(COALESCE(SUM(c.upvoteCount), 0) AS int)) " +
           "FROM User u JOIN Complaint c ON c.user = u " +
           "GROUP BY u.id, u.name " +
           "ORDER BY SUM(c.upvoteCount) DESC")
    List<LeaderboardDto> findTopCommunityContributors(Pageable pageable);
}