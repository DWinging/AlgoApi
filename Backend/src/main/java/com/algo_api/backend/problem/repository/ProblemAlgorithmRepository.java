package com.algo_api.backend.problem.repository;

import com.algo_api.backend.problem.entity.ProblemAlgorithm;
import com.algo_api.backend.problem.entity.ProblemAlgorithmId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemAlgorithmRepository extends JpaRepository<ProblemAlgorithm, ProblemAlgorithmId> {
}
