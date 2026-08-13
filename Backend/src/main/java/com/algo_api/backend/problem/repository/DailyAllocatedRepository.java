package com.algo_api.backend.problem.repository;

import com.algo_api.backend.problem.entity.DailyAllocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyAllocatedRepository extends JpaRepository<DailyAllocation, Long> {

    Optional<DailyAllocation> findByUser_IdAndAllocatedDate(
            Long userId,
            LocalDate allocatedDate
    );
}
