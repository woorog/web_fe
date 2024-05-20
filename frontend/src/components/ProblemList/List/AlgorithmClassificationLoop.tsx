import{ memo, useState, useEffect } from 'react';

type Text = {
  kr: string;
  en: string;
};

const texts: Text[] = [
  { "kr": "#수학", "en": "math" },
  { "kr": "#구현", "en": "implementation" },
  { "kr": "#문자열", "en": "string" },
  { "kr": "#정렬", "en": "sorting" },
  { "kr": "#기하학", "en": "geometry" },
  { "kr": "#정수론", "en": "number_theory" },
  { "kr": "#트리", "en": "trees" },
  { "kr": "#스택", "en": "stack" },
  { "kr": "#큐", "en": "queue" },
  { "kr": "#힙", "en": "heap" },
  { "kr": "#그래프", "en": "graph" },
  { "kr": "#배열", "en": "array" },
  { "kr": "#탐색", "en": "search" },
  { "kr": "#정렬", "en": "sort" },
  { "kr": "#리스트", "en": "list" },
  { "kr": "#해시", "en": "hash" },
  { "kr": "#세그먼트 트리", "en": "segment_tree" },
  { "kr": "#우선순위 큐", "en": "priority_queue" },
  { "kr": "#이분 탐색", "en": "binary_search" },
  { "kr": "#비트", "en": "bit" },
  { "kr": "#비트마스크", "en": "bitmask" },
  { "kr": "#백트래킹", "en": "backtracking" },
  { "kr": "#분할 정복", "en": "divide_and_conquer" },
  { "kr": "#재귀", "en": "recursion" },
  { "kr": "#동적 계획법", "en": "dynamic_programming" },
  { "kr": "#탑다운", "en": "top_down" },
  { "kr": "#바텀업", "en": "bottom_up" },
  { "kr": "#피보나치", "en": "fibonacci" },
  { "kr": "#메모이제이션", "en": "memoization" },
  { "kr": "#트라이", "en": "trie" },
  { "kr": "#동적 계획법", "en": "dp" },
  { "kr": "#정렬 알고리즘", "en": "sorting_algorithms" },
  { "kr": "#병합 정렬", "en": "merge_sort" },
  { "kr": "#퀵 정렬", "en": "quick_sort" },
  { "kr": "#삽입 정렬", "en": "insertion_sort" },
  { "kr": "#선택 정렬", "en": "selection_sort" },
  { "kr": "#버블 정렬", "en": "bubble_sort" },
  { "kr": "#힙 정렬", "en": "heap_sort" },
  { "kr": "#셸 정렬", "en": "shell_sort" },
  { "kr": "#계수 정렬", "en": "counting_sort" },
  { "kr": "#기수 정렬", "en": "radix_sort" },
  { "kr": "#기본 정렬", "en": "basic_sorting" },
  { "kr": "#버킷 정렬", "en": "bucket_sort" },
  { "kr": "#톱니 정렬", "en": "gnome_sort" },
  { "kr": "#평균 케이스", "en": "average_case" },
  { "kr": "#최악 케이스", "en": "worst_case" },
  { "kr": "#최선 케이스", "en": "best_case" },
  { "kr": "#공간 복잡도", "en": "space_complexity" },
  { "kr": "#시간 복잡도", "en": "time_complexity" },
  { "kr": "#그래프 이론", "en": "graph_theory" },
  { "kr": "#그래프 탐색", "en": "graph_search" },
  { "kr": "#깊이 우선 탐색", "en": "dfs" },
  { "kr": "#너비 우선 탐색", "en": "bfs" },
  { "kr": "#탐욕 알고리즘", "en": "greedy" },
  { "kr": "#최단 경로", "en": "shortest_path" },
  { "kr": "#최소 스패닝 트리", "en": "mst" },
  { "kr": "#다익스트라", "en": "dijkstra" },
  { "kr": "#벨만 포드", "en": "bellman_ford" },
  { "kr": "#플로이드 워셜", "en": "floyd_warshall" },
  { "kr": "#위상 정렬", "en": "topological_sort" },
  { "kr": "#에이 스타", "en": "a_star" },
  { "kr": "#최대 유량", "en": "max_flow" },
  { "kr": "#플로이드–워셜", "en": "floyd_warshall" },
  { "kr": "#유클리드 호제법", "en": "euclidean_algorithm" },
  { "kr": "#분리 집합", "en": "disjoint_set" },
  { "kr": "#트리", "en": "tree" },
  { "kr": "#이진 트리", "en": "binary_tree" },
  { "kr": "#이진 탐색 트리", "en": "binary_search_tree" },
  { "kr": "#균형 이진 트리", "en": "balanced_binary_tree" },
  { "kr": "#AVL 트리", "en": "avl_tree" },
  { "kr": "#레드 블랙 트리", "en": "red_black_tree" },
  { "kr": "#B 트리", "en": "b_tree" },
  { "kr": "#B+ 트리", "en": "b_plus_tree" },
  { "kr": "#최대 힙", "en": "max_heap" },
  { "kr": "#최소 힙", "en": "min_heap" },
  { "kr": "#덱", "en": "deque" },
  { "kr": "#해싱", "en": "hashing" },
  { "kr": "#동적 테이블", "en": "dynamic_table" },
  { "kr": "#정적 테이블", "en": "static_table" },
  { "kr": "#리스트", "en": "list" },
  { "kr": "#링크드 리스트", "en": "linked_list" },
  { "kr": "#더블 링크드 리스트", "en": "doubly_linked_list" },
  { "kr": "#원형 링크드 리스트", "en": "circular_linked_list" },
  { "kr": "#스킵 리스트", "en": "skip_list" }
]

const AlgorithmClassificationLoop = () => {
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

  const usedTexts: string[] = [];
  const maxUsedTexts = 5;
  const getCurrentText = (text: Text) => {
    let newText = text;
    const previousText = usedTexts[usedTexts.length - 1];
  
    if (usedTexts.includes(text.kr) || text.kr === previousText) {
      const availableTexts = texts.filter(t => !usedTexts.includes(t.kr) && t.kr !== previousText);
      newText = availableTexts[Math.floor(Math.random() * availableTexts.length)];
    }
  
    usedTexts.push(newText.kr);
    if (usedTexts.length > maxUsedTexts) {
      usedTexts.shift();
    }
  
    return newText;
  };

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="flex flex-col items-center justify-center w-full max-w-screen-lg mb-2 md:mb-5 lg:mb-10">
        <div className={`${fade} transition-opacity duration-1000 text-center`}>
          {getCurrentText(texts[currentIndex]).kr.split('\n').map((line, index) => (
            <p key={index} className="text-xl sm:text-4xl md:text-6xl lg:text-8xl text-white">
              {line}
            </p>
          ))}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-500">
            {texts[currentIndex].en}
          </p>
        </div>
      </div>
    </div>
  );  
};

export default memo(AlgorithmClassificationLoop);