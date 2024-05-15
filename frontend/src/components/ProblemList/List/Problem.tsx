import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import uuid from 'react-uuid';

type ProblemProps = {
problemId: number;
};

// texts 배열의 객체 타입을 정의합니다.
type Text = {
kr: string;
en: string;
};

const texts: Text[] = [
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
    { "kr": "#데이크스트라", "en": "dijkstra" },
    { "kr": "#백트래킹", "en": "backtracking" },
    { "kr": "#트리를 사용한 집합과 맵", "en": "tree_set" },
    { "kr": "#스위핑", "en": "sweeping" },
    { "kr": "#분리 집합", "en": "disjoint_set" },
    { "kr": "#파싱", "en": "parsing" },
    { "kr": "#우선순위 큐", "en": "priority_queue" },
    { "kr": "#트리에서의 다이나믹 프로그래밍", "en": "dp_tree" },
    { "kr": "#분할 정복", "en": "divide_and_conquer" },
    { "kr": "#두 포인터", "en": "two_pointer" },
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
    { "kr": "#위상 정렬", "en": "topological_sorting" },
    { "kr": "#플로이드–워셜", "en": "floyd_warshall" },
    { "kr": "#최소 공통 조상", "en": "lca" },
    { "kr": "#해싱", "en": "hashing" },
    { "kr": "#포함 배제의 원리", "en": "inclusion_and_exclusion" },
    { "kr": "#강한 연결 요소", "en": "scc" },
    { "kr": "#무작위화", "en": "randomization" },
    { "kr": "#희소 배열", "en": "sparse_table" },
    { "kr": "#고속 푸리에 변환", "en": "fft" },
    { "kr": "#작은 집합에서 큰 집합으로 합치는 테크닉", "en": "smaller_to_larger" },
    { "kr": "#트라이", "en": "trie" },
    { "kr": "#덱", "en": "deque" },
    { "kr": "#최소 비용 최대 유량", "en": "mcmf" },
    { "kr": "#선분 교차 판정", "en": "line_intersection" },
    { "kr": "#제곱근 분할법", "en": "sqrt_decomposition" },
    { "kr": "#미적분학", "en": "calculus" },
    { "kr": "#볼록 껍질을 이용한 최적화", "en": "cht" },
    { "kr": "#휴리스틱", "en": "heuristics" },
    { "kr": "#모듈로 곱셈 역원", "en": "modular_multiplicative_inverse" },
    { "kr": "#3차원 기하학", "en": "geometry_3d" },
    { "kr": "#슬라이딩 윈도우", "en": "sliding_window" },
    { "kr": "#접미사 배열과 LCP 배열", "en": "suffix_array" },
    { "kr": "#오일러 경로 테크닉", "en": "euler_tour_technique" },
    { "kr": "#센트로이드", "en": "centroid" },
    { "kr": "#스프라그–그런디 정리", "en": "sprague_grundy" },
    { "kr": "#삼분 탐색", "en": "ternary_search" },
    { "kr": "#중간에서 만나기", "en": "mitm" },
    { "kr": "#피타고라스 정리", "en": "pythagoras" },
    { "kr": "#비트 집합", "en": "bitset" },
    { "kr": "#순열 사이클 분할", "en": "permutation_cycle_decomposition" },
    { "kr": "#가장 긴 증가하는 부분 수열: O(n log n)", "en": "lis" }
]

const Problem = ({ problemId }: ProblemProps) => {
  const navigate = useNavigate();
  const [roomUrl, setRoomUrl] = useState('');
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * texts.length));
  const [fade, setFade] = useState('opacity-100');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFade('opacity-0');
      setTimeout(() => {
        setCurrentIndex(Math.floor(Math.random() * texts.length));
        setFade('opacity-100');
      }, 1000);
    }, 3000);

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
      alert('Please enter a valid room URL');
    }
  };

  const getCurrentText = (text: Text) => {
    if (text.kr.length > 9) {
      const firstSpaceIndex = text.kr.indexOf(' ', 7);
      if (firstSpaceIndex !== -1) {
        return {
          ...text,
          kr: text.kr.substring(0, firstSpaceIndex) + '\n' + text.kr.substring(firstSpaceIndex + 1),
        };
      }
    }
    return text;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-5 bg-black">
      <div className="flex flex-col items-center justify-center h-1/5 mb-40">
        <div className={`${fade} transition-opacity duration-1000`}>
          {getCurrentText(texts[currentIndex]).kr.split('\n').map((line, index) => (
            <p key={index} className="text-8xl text-white">
              {line}
            </p>
          ))}
          <p className="text-4xl text-gray-500">{texts[currentIndex].en}</p>
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        <input
          type="text"
          placeholder="방 URL을 입력해 참가하세요"
          value={roomUrl}
          onChange={(e) => setRoomUrl(e.target.value)}
          className="w-7/12 h-12 p-2 mb-5 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 text-black bg-white"
        />
        <button
          onClick={handleJoinRoom}
          className="w-5/12 h-12 mb-5 text-black bg-white rounded-lg text-xl font-bold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
        >
          방 참가하기
        </button>
        <button
          onClick={handleCreateRoom}
          className="w-5/12 h-12 mb-5 text-black bg-white rounded-lg text-xl font-bold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
        >
          방 만들기
        </button>
      </div>
    </div>
  );
};

export default memo(Problem);