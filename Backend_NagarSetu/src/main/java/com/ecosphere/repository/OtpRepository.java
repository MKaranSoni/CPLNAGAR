package com.ecosphere.repository;

import com.ecosphere.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findByEmail(String email);
    // Added @Modifying and @Transactional because derived delete queries in Spring Data JPA 
    // require an explicit transaction and modifying boundary to execute reliably.
    @Modifying
    @Transactional
    void deleteByEmail(String email);
}