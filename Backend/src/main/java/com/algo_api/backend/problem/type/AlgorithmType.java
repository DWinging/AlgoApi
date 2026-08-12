package com.algo_api.backend.problem.type;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum AlgorithmType {

    IMPLEMENTATION("구현"),
    SIMULATION("시뮬레이션"),
    SORTING("정렬"),

    GREEDY("그리디"),
    DYNAMIC_PROGRAMMING("동적 계획법"),
    TREE_DP("트리에서의 동적 계획법"),

    BFS("너비 우선 탐색"),
    DFS("깊이 우선 탐색"),
    ZERO_ONE_BFS("0-1 BFS"),
    BACKTRACKING("백트래킹"),

    DIJKSTRA("다익스트라"),
    FLOYD_WARSHALL("플로이드-워셜"),
    BELLMAN_FORD("벨만-포드"),
    SPFA("SPFA"),

    GRAPH("그래프"),
    TREE("트리"),
    UNION_FIND("유니온 파인드"),
    MINIMUM_SPANNING_TREE("최소 스패닝 트리"),
    TOPOLOGICAL_SORT("위상 정렬"),

    BINARY_SEARCH("이진 탐색"),
    PARAMETRIC_SEARCH("파라메트릭 서치"),
    TWO_POINTER("투 포인터"),
    SLIDING_WINDOW("슬라이딩 윈도우"),
    LIS("최장 증가 부분 수열"),

    PREFIX_SUM("누적 합"),
    DIFFERENCE_ARRAY("차분 배열"),
    SEGMENT_TREE("세그먼트 트리"),
    FENWICK_TREE("펜윅 트리"),

    STACK("스택"),
    QUEUE("큐"),
    DEQUE("덱"),
    PRIORITY_QUEUE("우선순위 큐"),
    MONOTONIC_DEQUE("모노톤 덱"),
    LINKED_LIST("연결 리스트"),
    SPARSE_ARRAY("희소 배열"),
    DATA_STRUCTURE("자료구조"),

    HASH("해시"),
    TRIE("트라이"),

    STRING("문자열"),

    RECURSION("재귀"),
    DIVIDE_AND_CONQUER("분할 정복"),

    BITMASK("비트마스킹"),

    MATH("수학"),
    NUMBER_THEORY("정수론"),
    COMBINATORICS("조합론"),
    GEOMETRY("기하");

    private final String displayName;

    AlgorithmType(String displayName) {
        this.displayName = displayName;
    }

    public static AlgorithmType fromDisplayName(String displayName) {
        return Arrays.stream(values())
                .filter(value -> value.getDisplayName().equals(displayName))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "지원하지 않는 알고리즘입니다: " + displayName
                        )
                );
    }
}