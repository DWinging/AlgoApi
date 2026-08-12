package com.algo_api.backend.problem.entity;

import com.algo_api.backend.problem.type.AlgorithmType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "algorithm")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Algorithm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 30)
    private AlgorithmType name;
}
