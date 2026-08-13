package com.algo_api.backend.problem.repository;

import com.algo_api.backend.problem.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProblemRepository extends JpaRepository<Problem, Long> {

    @Query(
            value = """
                SELECT p.*
                FROM problems p
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM daily_allocation da
                    WHERE da.problem_id = p.id
                      AND da.user_id = :userId
                )
                ORDER BY RAND()
                LIMIT 1
                """,
            nativeQuery = true
    )
    Optional<Problem> findRandomUnallocated(@Param("userId") Long userId);
}
