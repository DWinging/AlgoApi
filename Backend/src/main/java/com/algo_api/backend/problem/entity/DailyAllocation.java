package com.algo_api.backend.problem.entity;

import com.algo_api.backend.auth.entity.ApiKey;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "daily_allocation",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"key_id", "allocated_date"})
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class DailyAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "allocated_date", nullable = false)
    private LocalDate allocatedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "key_id", nullable = false)
    private ApiKey apiKey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;
}
