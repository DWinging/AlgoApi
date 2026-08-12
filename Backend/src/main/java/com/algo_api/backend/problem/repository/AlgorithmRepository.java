package com.algo_api.backend.problem.repository;

import com.algo_api.backend.problem.entity.Algorithm;
import com.algo_api.backend.problem.type.AlgorithmType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlgorithmRepository extends JpaRepository<Algorithm, Long> {

    Optional<Algorithm> findByName(AlgorithmType name);

}
