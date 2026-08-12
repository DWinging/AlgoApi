package com.algo_api.backend.problem.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "problem_algorithms")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ProblemAlgorithm {

    @EmbeddedId
    private ProblemAlgorithmId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("problemId")
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("algorithmId")
    @JoinColumn(name = "algo_id", nullable = false)
    private Algorithm algorithm;
}
