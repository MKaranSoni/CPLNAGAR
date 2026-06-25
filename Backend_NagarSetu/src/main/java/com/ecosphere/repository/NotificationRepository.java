package com.ecosphere.repository;

import com.ecosphere.entity.Notification;
import com.ecosphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    List<Notification> findAllByOrderByCreatedAtDesc();
}
