package com.algo_api.backend.problem.service;

import com.algo_api.backend.auth.entity.ApiKey;
import com.algo_api.backend.auth.entity.User;
import com.algo_api.backend.problem.dto.ProblemCreateRequest;
import com.algo_api.backend.problem.dto.ProblemResponse;
import com.algo_api.backend.problem.entity.*;
import com.algo_api.backend.problem.repository.AlgorithmRepository;
import com.algo_api.backend.problem.repository.DailyAllocatedRepository;
import com.algo_api.backend.problem.repository.ProblemAlgorithmRepository;
import com.algo_api.backend.problem.repository.ProblemRepository;
import com.algo_api.backend.problem.type.AlgorithmType;
import com.algo_api.backend.problem.type.Platform;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final AlgorithmRepository algorithmRepository;
    private final ProblemAlgorithmRepository problemAlgorithmRepository;
    private final DailyAllocatedRepository dailyAllocatedRepository;

    @Transactional
    public ProblemResponse create(ProblemCreateRequest request) {
        Platform platform = Platform.fromDisplayName(request.platform());

        Set<AlgorithmType> algorithmTypes = request.algorithms() == null
                ? Set.of()
                : request.algorithms().stream()
                .map(AlgorithmType::fromDisplayName)
                .collect(Collectors.toSet());

        Problem problem = Problem.builder()
                .platform(platform)
                .number(request.number())
                .title(request.title())
                .level(request.level())
                .url(request.url())
                .build();

        problemRepository.save(problem);

        for (AlgorithmType type : algorithmTypes) {
            Algorithm algorithm = algorithmRepository.findByName(type)
                    .orElseGet(() -> algorithmRepository.save(
                            Algorithm.builder()
                                    .name(type)
                                    .build()
                    ));

            ProblemAlgorithm problemAlgorithm = ProblemAlgorithm.builder()
                    .id(new ProblemAlgorithmId(
                            problem.getId(),
                            algorithm.getId()
                    ))
                    .problem(problem)
                    .algorithm(algorithm)
                    .build();

            problemAlgorithmRepository.save(problemAlgorithm);
        }

        Set<String> algorithms = algorithmTypes.stream()
                .map(AlgorithmType::getDisplayName)
                .collect(Collectors.toSet());

        return new ProblemResponse(
                problem.getId(),
                platform.getDisplayName(),
                problem.getNumber(),
                problem.getTitle(),
                problem.getLevel(),
                problem.getUrl(),
                algorithms,
                problem.getCreatedAt()
        );
    }

    @Transactional
    public ProblemResponse recommend(ApiKey apiKey) {
        User user = apiKey.getUser();
        LocalDate today = LocalDate.now();

        DailyAllocation allocation = dailyAllocatedRepository
                .findByUser_IdAndAllocatedDate(user.getId(), today)
                .orElseGet(() -> createDailyAllocation(user, today));

        return toResponse(allocation.getProblem());
    }

    private ProblemResponse toResponse(Problem problem) {
        Set<String> algorithms = problem.getAlgorithms().stream()
                .map(ProblemAlgorithm::getAlgorithm)
                .map(Algorithm::getName)
                .map(AlgorithmType::getDisplayName)
                .collect(Collectors.toSet());

        return new ProblemResponse(
                problem.getId(),
                problem.getPlatform().getDisplayName(),
                problem.getNumber(),
                problem.getTitle(),
                problem.getLevel(),
                problem.getUrl(),
                algorithms,
                problem.getCreatedAt()
        );
    }

    private DailyAllocation createDailyAllocation(User user, LocalDate today) {
        Problem problem = getRandomProblem(user);

        DailyAllocation allocation = DailyAllocation.builder()
                .user(user)
                .problem(problem)
                .allocatedDate(today)
                .build();

        return dailyAllocatedRepository.save(allocation);
    }

    private Problem getRandomProblem(User user) {
        return problemRepository.findRandomUnallocated(user.getId())
                .orElseThrow(() ->
                        new IllegalStateException("추천 가능한 문제가 없습니다.")
                );
    }
}