package com.algo_api.backend.problem.service;

import com.algo_api.backend.auth.entity.User;
import com.algo_api.backend.auth.repository.UserRepository;
import com.algo_api.backend.global.exception.BusinessException;
import com.algo_api.backend.global.exception.ErrorCode;
import com.algo_api.backend.problem.dto.ProblemCreateRequest;
import com.algo_api.backend.problem.dto.ProblemHistoryResponse;
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
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final AlgorithmRepository algorithmRepository;
    private final ProblemAlgorithmRepository problemAlgorithmRepository;
    private final DailyAllocatedRepository dailyAllocatedRepository;
    private final UserRepository userRepository;

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
    public ProblemResponse recommend(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND)
                );

        LocalDate today = LocalDate.now();

        DailyAllocation allocation = dailyAllocatedRepository
                .findByUser_IdAndAllocatedDate(user.getId(), today)
                .orElseGet(() -> createDailyAllocation(user, today));

        return toResponse(allocation.getProblem());
    }

    private ProblemResponse toResponse(Problem problem) {
        return new ProblemResponse(
                problem.getId(),
                problem.getPlatform().getDisplayName(),
                problem.getNumber(),
                problem.getTitle(),
                problem.getLevel(),
                problem.getUrl(),
                getAlgorithms(problem),
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
                        new BusinessException(ErrorCode.NO_AVAILABLE_PROBLEM)
                );
    }

    @Transactional
    public List<ProblemHistoryResponse> getHistory(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND)
                );

        return dailyAllocatedRepository
                .findAllByUser_IdOrderByAllocatedDateDesc(userId)
                .stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    private ProblemHistoryResponse toHistoryResponse(DailyAllocation allocation) {
        Problem problem = allocation.getProblem();

        return new ProblemHistoryResponse(
                allocation.getAllocatedDate(),
                problem.getId(),
                problem.getPlatform().getDisplayName(),
                problem.getNumber(),
                problem.getTitle(),
                problem.getLevel(),
                problem.getUrl(),
                getAlgorithms(problem)
        );
    }

    private Set<String> getAlgorithms(Problem problem) {
        return problem.getAlgorithms().stream()
                .map(ProblemAlgorithm::getAlgorithm)
                .map(Algorithm::getName)
                .map(AlgorithmType::getDisplayName)
                .collect(Collectors.toSet());
    }
}
