import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import uuid from 'react-uuid';

type ProblemProps = {
    problemId: number;
};

const texts = [
    { "kr": "#수학", "en": "math" },
    { "kr": "#구현", "en": "implementation" },
    { "kr": "#다이나믹 프로그래밍", "en": "dp" },
    { "kr": "#자료 구조", "en": "data_structures" },
    { "kr": "#그래프 이론", "en": "graphs" },
    { "kr": "#그리디 알고리즘", "en": "greedy" },
    { "kr": "#문자열", "en": "string" },
    { "kr": "#브루트포스 알고리즘", "en": "bruteforcing" },
    { "kr": "#그래프 탐색", "en": "graph_traversal" },
    { "kr": "#정렬", "en": "sorting" },
    { "kr": "#기하학", "en": "geometry" },
    { "kr": "#애드 혹", "en": "ad_hoc" },
    { "kr": "#정수론", "en": "number_theory" },
    { "kr": "#트리", "en": "trees" },
    { "kr": "#세그먼트 트리", "en": "segtree" },
    { "kr": "#이분 탐색", "en": "binary_search" },
    { "kr": "#사칙연산", "en": "arithmetic" },
    { "kr": "#시뮬레이션", "en": "simulation" },
    { "kr": "#해 구성하기", "en": "constructive" },
    { "kr": "#너비 우선 탐색", "en": "bfs" },
    { "kr": "#누적 합", "en": "prefix_sum" },
    { "kr": "#조합론", "en": "combinatorics" },
    { "kr": "#많은 조건 분기", "en": "case_work" },
    { "kr": "#깊이 우선 탐색", "en": "dfs" },
    { "kr": "#최단 경로", "en": "shortest_path" },
    { "kr": "#비트마스킹", "en": "bitmask" },
    { "kr": "#해시를 사용한 집합과 맵", "en": "hash_set" },
    { "kr": "#다익스트라", "en": "dijkstra" },
    { "kr": "#백트래킹", "en": "backtracking" },
    { "kr": "#트리를 사용한 집합과 맵", "en": "tree_set" },
    { "kr": "#스위핑", "en": "sweeping" },
    { "kr": "#분리 집합", "en": "disjoint_set" },
    { "kr": "#파싱", "en": "parsing" },
    { "kr": "#우선순위 큐", "en": "priority_queue" },
    { "kr": "#트리에서의 다이나믹 프로그래밍", "en": "dp_tree" },
    { "kr": "#분할 정복", "en": "divide_and_conquer" },
    { "kr": "#투 포인터", "en": "two_pointer" },
    { "kr": "#매개 변수 탐색", "en": "parametric_search" },
    { "kr": "#스택", "en": "stack" },
    { "kr": "#게임 이론", "en": "game_theory" },
    { "kr": "#최대 유량", "en": "flow" },
    { "kr": "#소수 판정", "en": "primality_test" },
    { "kr": "#느리게 갱신되는 세그먼트 트리", "en": "lazyprop" },
    { "kr": "#비트필드를 이용한 다이나믹 프로그래밍", "en": "dp_bitfield" },
    { "kr": "#확률론", "en": "probability" },
    { "kr": "#분할 정복을 이용한 거듭제곱", "en": "exponentiation_by_squaring" },
    { "kr": "#임의 정밀도 / 큰 수 연산", "en": "arbitrary_precision" },
    { "kr": "#오프라인 쿼리", "en": "offline_queries" },
    { "kr": "#배낭 문제", "en": "knapsack" },
    { "kr": "#재귀", "en": "recursion" },
    { "kr": "#값 / 좌표 압축", "en": "coordinate_compression" },
    { "kr": "#런타임 전의 전처리", "en": "precomputation" },
    { "kr": "#최소 스패닝 트리", "en": "mst" },
    { "kr": "#에라토스테네스의 체", "en": "sieve" },
    { "kr": "#유클리드 호제법", "en": "euclidean" },
    { "kr": "#이분 매칭", "en": "bipartite_matching" },
    { "kr": "#방향 비순환 그래프", "en": "dag" },
    { "kr": "#볼록 껍질", "en": "convex_hull" },
    { "kr": "#선형대수학", "en": "linear_algebra" },
    { "kr": "#위상 정렬", "en": "topological_sorting" }
]

const Problem = ({ problemId }: ProblemProps) => {
    const navigate = useNavigate();
    const [roomUrl, setRoomUrl] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [opacity, setOpacity] = useState('opacity-100');

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    const handleCreateRoom = () => {
        const room = btoa(uuid());
        localStorage.setItem(`problem${problemId}`, room);
        navigate(`/problem/multi/${problemId}/${room}`);
    };

    const handleJoinRoom = () => {
        if (roomUrl) {
            if (/^https?:\/\//.test(roomUrl)) {
                window.location.href = roomUrl;
            } else {
                navigate(roomUrl);
            }
        } else {
            alert("Please enter a valid room URL");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-5 bg-black">
            <div className={`${opacity} transition-opacity duration-1000 mb-40`}>
                <p className="text-8xl text-white">{texts[currentIndex].kr}</p>
                <p className="text-4xl text-gray-500">{texts[currentIndex].en}</p>
            </div>
            <input
                type="text"
                placeholder="방 URL을 입력해 참가하세요"
                value={roomUrl}
                onChange={(e) => setRoomUrl(e.target.value)}
                className="w-11/12 h-12 p-2 mb-5 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 text-black bg-white"
            />
            <button
                onClick={handleJoinRoom}
                className="w-6/12 h-12 mb-5 text-black bg-white rounded-lg text-xl font-bold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            >
                방 참가하기
            </button>
            <button
                onClick={handleCreateRoom}
                className="w-6/12 h-12 mb-5 text-black bg-white rounded-lg text-xl font-bold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            >
                방 만들기
            </button>
        </div>
    );
};

export default memo(Problem);