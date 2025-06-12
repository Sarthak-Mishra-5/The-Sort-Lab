"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, Pause, RotateCcw, Shuffle, Moon, Sun, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2Icon } from "lucide-react";

type Algorithm = {
  name: string;
  type: "sorting" | "searching";
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  funFact: string;
};

const algorithms: Record<string, Algorithm> = {
  "bubble-sort": {
    name: "Bubble Sort",
    type: "sorting",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    funFact:
      'Named "bubble sort" because smaller elements "bubble" to the top of the list, just like air bubbles rising to the surface of water!',
  },
  "selection-sort": {
    name: "Selection Sort",
    type: "sorting",
    timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    funFact:
      "It's like picking the smallest apple from a pile again and again—great for understanding how selection works!",
  },
  "insertion-sort": {
    name: "Insertion Sort",
    type: "sorting",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    funFact:
      "Insertion sort is how most people naturally sort playing cards in their hands - one card at a time!",
  },
  "merge-sort": {
    name: "Merge Sort",
    type: "sorting",
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    spaceComplexity: "O(n)",
    funFact:
      "Invented by John von Neumann in 1945, merge sort is a divide-and-conquer algorithm that's guaranteed to be stable!",
  },
  "quick-sort": {
    name: "Quick Sort",
    type: "sorting",
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(log n)",
    funFact:
      "Despite its worst-case O(n²) complexity, quicksort is often faster in practice than other O(n log n) algorithms!",
  },
  "linear-search": {
    name: "Linear Search",
    type: "searching",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    funFact:
      "Linear search is the only search algorithm that works on unsorted data - it checks every element one by one!",
  },
  "binary-search": {
    name: "Binary Search",
    type: "searching",
    timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    spaceComplexity: "O(1)",
    funFact:
      "Binary search is like finding a word in a dictionary - you always open to the middle and eliminate half the possibilities!",
  },
};

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble-sort");
  const [speed, setSpeed] = useState([50]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showValues, setShowValues] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);

  const generateRandomArray = useCallback(() => {
    const newArray = Array.from(
      { length: 20 },
      () => Math.floor(Math.random() * 300) + 10
    );
    setArray(newArray);
    setComparing([]);
    setSorted([]);
    setSearchResult(null);
    setCurrentStep("");
  }, []);

  useEffect(() => {
    generateRandomArray();
  }, [generateRandomArray]);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const stopVisualization = () => {
    setIsRunning(false);
    isRunningRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setComparing([]);
    setCurrentStep("");
  };

  const resetArray = () => {
    stopVisualization();
    generateRandomArray();
  };

  // Sorting Algorithms
  const bubbleSort = async (arr: number[]) => {
    const newArray = [...arr];
    const n = newArray.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!isRunningRef.current) return;

        setComparing([j, j + 1]);
        setCurrentStep(`Comparing elements at positions ${j} and ${j + 1}`);
        await sleep(101 - speed[0]);

        if (newArray[j] > newArray[j + 1]) {
          [newArray[j], newArray[j + 1]] = [newArray[j + 1], newArray[j]];
          setArray([...newArray]);
          setCurrentStep(`Swapped elements at positions ${j} and ${j + 1}`);
          await sleep(101 - speed[0]);
        }
      }
      setSorted((prev) => [...prev, n - i - 1]);
    }
    setSorted((prev) => [...prev, 0]);
    setComparing([]);
  };

  const selectionSort = async (arr: number[]) => {
    const newArray = [...arr];
    const n = newArray.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      setCurrentStep(`Finding minimum element from position ${i}`);

      for (let j = i + 1; j < n; j++) {
        if (!isRunningRef.current) return;

        setComparing([minIdx, j]);
        await sleep(101 - speed[0]);

        if (newArray[j] < newArray[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        [newArray[i], newArray[minIdx]] = [newArray[minIdx], newArray[i]];
        setArray([...newArray]);
        setCurrentStep(`Swapped minimum element to position ${i}`);
        await sleep(101 - speed[0]);
      }

      setSorted((prev) => [...prev, i]);
    }
    setSorted((prev) => [...prev, n - 1]);
    setComparing([]);
  };

  const insertionSort = async (arr: number[]) => {
    const newArray = [...arr];
    const n = newArray.length;

    setSorted([0]);

    for (let i = 1; i < n; i++) {
      const key = newArray[i];
      let j = i - 1;

      setCurrentStep(`Inserting element ${key} into sorted portion`);

      while (j >= 0 && newArray[j] > key) {
        if (!isRunningRef.current) return;

        setComparing([j, j + 1]);
        await sleep(101 - speed[0]);

        newArray[j + 1] = newArray[j];
        setArray([...newArray]);
        j--;
      }

      newArray[j + 1] = key;
      setArray([...newArray]);
      setSorted((prev) => [...prev, i]);
      await sleep(101 - speed[0]);
    }
    setComparing([]);
  };

  const mergeSort = async (arr: number[]) => {
    const newArray = [...arr];

    const merge = async (left: number, mid: number, right: number) => {
      const leftArr = newArray.slice(left, mid + 1);
      const rightArr = newArray.slice(mid + 1, right + 1);

      let i = 0,
        j = 0,
        k = left;

      while (i < leftArr.length && j < rightArr.length) {
        if (!isRunningRef.current) return;

        setComparing([left + i, mid + 1 + j]);
        setCurrentStep(`Merging subarrays: comparing elements`);
        await sleep(101 - speed[0]);

        if (leftArr[i] <= rightArr[j]) {
          newArray[k] = leftArr[i];
          i++;
        } else {
          newArray[k] = rightArr[j];
          j++;
        }
        k++;
        setArray([...newArray]);
      }

      while (i < leftArr.length) {
        newArray[k] = leftArr[i];
        i++;
        k++;
        setArray([...newArray]);
        await sleep(101 - speed[0]);
      }

      while (j < rightArr.length) {
        newArray[k] = rightArr[j];
        j++;
        k++;
        setArray([...newArray]);
        await sleep(101 - speed[0]);
      }
    };

    const mergeSortHelper = async (left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSortHelper(left, mid);
        await mergeSortHelper(mid + 1, right);
        await merge(left, mid, right);
      }
    };

    await mergeSortHelper(0, newArray.length - 1);
    setSorted(Array.from({ length: newArray.length }, (_, i) => i));
    setComparing([]);
  };

  const quickSort = async (arr: number[]) => {
    const newArray = [...arr];

    const partition = async (low: number, high: number) => {
      const pivot = newArray[high];
      let i = low - 1;

      setCurrentStep(`Partitioning around pivot: ${pivot}`);

      for (let j = low; j < high; j++) {
        if (!isRunningRef.current) return i;

        setComparing([j, high]);
        await sleep(101 - speed[0]);

        if (newArray[j] < pivot) {
          i++;
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
          setArray([...newArray]);
          await sleep(101 - speed[0]);
        }
      }
      [newArray[i + 1], newArray[high]] = [newArray[high], newArray[i + 1]];
      setArray([...newArray]);
      await sleep(101 - speed[0]);

      return i + 1;
    };

    const quickSortHelper = async (low: number, high: number) => {
      if (low < high) {
        const pi = await partition(low, high);
        if (!isRunningRef.current) return;

        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
      }
    };

    await quickSortHelper(0, newArray.length - 1);
    setSorted(Array.from({ length: newArray.length }, (_, i) => i));
    setComparing([]);
  };

  // Searching Algorithms
  const linearSearch = async (arr: number[], target: number) => {
    setCurrentStep(`Searching for ${target} using Linear Search`);

    for (let i = 0; i < arr.length; i++) {
      if (!isRunningRef.current) return;

      setComparing([i]);
      setCurrentStep(`Checking element at position ${i}: ${arr[i]}`);
      await sleep(101 - speed[0]);

      if (arr[i] === target) {
        setSearchResult(i);
        setCurrentStep(`Found ${target} at position ${i}!`);
        return;
      }
    }

    setSearchResult(-1);
    setCurrentStep(`${target} not found in the array`);
    setComparing([]);
  };

  const binarySearch = async (arr: number[], target: number) => {
    // First sort the array for binary search
    const sortedArray = [...arr].sort((a, b) => a - b);
    setArray(sortedArray);
    setCurrentStep("Array sorted for Binary Search");
    await sleep(500);

    let left = 0;
    let right = sortedArray.length - 1;

    while (left <= right) {
      if (!isRunningRef.current) return;

      const mid = Math.floor((left + right) / 2);
      setComparing([left, mid, right]);
      setCurrentStep(
        `Checking middle element at position ${mid}: ${sortedArray[mid]}`
      );
      await sleep(101 - speed[0]);

      if (sortedArray[mid] === target) {
        setSearchResult(mid);
        setCurrentStep(`Found ${target} at position ${mid}!`);
        return;
      }

      if (sortedArray[mid] < target) {
        left = mid + 1;
        setCurrentStep(`${sortedArray[mid]} < ${target}, searching right half`);
      } else {
        right = mid - 1;
        setCurrentStep(`${sortedArray[mid]} > ${target}, searching left half`);
      }

      await sleep(101 - speed[0]);
    }

    setSearchResult(-1);
    setCurrentStep(`${target} not found in the array`);
    setComparing([]);
  };

  const startVisualization = async () => {
    if (isRunning) {
      stopVisualization();
      return;
    }

    setIsRunning(true);
    isRunningRef.current = true;
    setComparing([]);
    setSorted([]);
    setSearchResult(null);

    const algorithm = algorithms[selectedAlgorithm];

    if (algorithm.type === "searching") {
      const target = Number.parseInt(searchValue);
      if (isNaN(target)) {
        setCurrentStep("Please enter a valid number to search");
        setIsRunning(false);
        isRunningRef.current = false;
        return;
      }

      if (selectedAlgorithm === "linear-search") {
        await linearSearch(array, target);
      } else if (selectedAlgorithm === "binary-search") {
        await binarySearch(array, target);
      }
    } else {
      // Sorting algorithms
      switch (selectedAlgorithm) {
        case "bubble-sort":
          await bubbleSort(array);
          break;
        case "selection-sort":
          await selectionSort(array);
          break;
        case "insertion-sort":
          await insertionSort(array);
          break;
        case "merge-sort":
          await mergeSort(array);
          break;
        case "quick-sort":
          await quickSort(array);
          break;
      }
    }

    setIsRunning(false);
    isRunningRef.current = false;
    setComparing([]);

    if (algorithm.type === "sorting") {
      setCurrentStep("Sorting completed!");
    }
  };

  const getBarColor = (index: number) => {
    if (searchResult === index) return "bg-green-500";
    if (comparing.includes(index)) return "bg-red-500";
    if (sorted.includes(index)) return "bg-green-400";
    return "bg-blue-400";
  };

  const currentAlgorithm = algorithms[selectedAlgorithm];

  return (
    <div
      className={`gabarito min-h-screen  flex flex-col gap-4 transition-colors duration-300 p-4 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
          : "bg-gradient-to-br from-slate-50 to-slate-100"
      }`}
    >
      {/* Header */}
      <div className="text-center space-y-2 relative">
        <div className="hidden md:block absolute top-0 right-0 flex items-center gap-4">
          {/* Values Display Toggle */}
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 hidden md:block" />
            <Switch
              checked={showValues}
              onCheckedChange={setShowValues}
              aria-label="Show array values"
            />
            <span className="text-sm">Values</span>
          </div>

          {/* Dark Mode Toggle */}
          {/* <div className="flex items-center gap-2">
            {isDarkMode ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              aria-label="Toggle dark mode"
            />
            <span className="text-sm">Dark</span>
          </div> */}
        </div>

        <h1
          className={`gabarito text-4xl font-bold ${
            isDarkMode ? "text-white" : "text-slate-800"
          }`}
        >
          Algorithm Visualizer
        </h1>
        <p className={`${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
          Interactive sorting and searching algorithm visualization
        </p>
      </div>

      {/* Array Values Display */}
      {showValues && (
        <Card className={isDarkMode ? "bg-slate-800 border-slate-700" : ""}>
          <CardHeader>
            <CardTitle className={isDarkMode ? "text-white" : ""}>
              Array Values
            </CardTitle>
            <CardDescription className={isDarkMode ? "text-slate-300" : ""}>
              Current values in the array (sorted for easy reference)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {[...new Set(array)]
                .sort((a, b) => a - b)
                .map((value, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={`text-xs ${
                      isDarkMode
                        ? "bg-slate-700 text-slate-200 border-slate-600"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {value}
                  </Badge>
                ))}
            </div>
            <p
              className={`text-xs mt-2 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Total unique values: {new Set(array).size} | Array length:{" "}
              {array.length}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <Card className={isDarkMode ? "bg-slate-800 border-slate-700" : ""}>
        <CardHeader>
          <CardTitle className={isDarkMode ? "text-white" : ""}>
            Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Algorithm</Label>
              <Select
                value={selectedAlgorithm}
                onValueChange={setSelectedAlgorithm}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bubble-sort">Bubble Sort</SelectItem>
                  <SelectItem value="selection-sort">Selection Sort</SelectItem>
                  <SelectItem value="insertion-sort">Insertion Sort</SelectItem>
                  <SelectItem value="merge-sort">Merge Sort</SelectItem>
                  <SelectItem value="quick-sort">Quick Sort</SelectItem>
                  <SelectItem value="linear-search">Linear Search</SelectItem>
                  <SelectItem value="binary-search">Binary Search</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentAlgorithm.type === "searching" && (
              <div className="space-y-2">
                <Label>Search Value</Label>
                <Input
                  type="number"
                  placeholder="Enter number to search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Speed: {speed[0]}%</Label>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={startVisualization}
              disabled={isRunning && currentAlgorithm.type === "sorting"}
            >
              {isRunning ? (
                <Loader2Icon className="animate-spin w-4 h-4 mr-2" />
              ) : (
                // <Pause className="" />
                <Play className="w-4 h-4 mr-2" />
              )}
              {isRunning ? "Wait" : "Start"}
            </Button>
            <Button onClick={resetArray} variant="outline" disabled={isRunning}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            {/* <Button
              onClick={generateRandomArray}
              variant="outline"
              disabled={isRunning}
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle
            </Button> */}
          </div>

          {currentStep && (
            <div
              className={`p-3 rounded-lg border ${
                isDarkMode
                  ? "bg-blue-900/50 border-blue-700 text-blue-200"
                  : "bg-blue-50 border-blue-200 text-blue-800"
              }`}
            >
              <p className="text-sm font-medium">{currentStep}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visualization */}
      <Card className={isDarkMode ? "bg-slate-800 border-slate-700" : ""}>
        <CardHeader>
          <CardTitle className={isDarkMode ? "text-white" : ""}>
            Visualization
          </CardTitle>
          <CardDescription className={isDarkMode ? "text-slate-300" : ""}>
            {currentAlgorithm.type === "sorting"
              ? "Watch how the algorithm sorts the array"
              : "See how the search algorithm finds elements"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`h-80 flex items-end justify-center gap-1 p-4 rounded-lg overflow-hidden ${
              isDarkMode ? "bg-slate-700" : "bg-slate-50"
            }`}
          >
            {array.map((value, index) => (
              <div
                key={index}
                className={`transition-all duration-200 ${getBarColor(
                  index
                )} rounded-t-sm`}
                style={{
                  height: `${(value / 300) * 100}%`,
                  width: `${Math.max(800 / array.length - 2, 2)}px`,
                }}
                title={`Index: ${index}, Value: ${value}`}
              />
            ))}
          </div>

          <div
            className={`flex flex-wrap gap-4 mt-4 text-sm ${
              isDarkMode ? "text-slate-300" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span>Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>Sorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Found</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Information and Fun Facts */}
      <div className="grid md:grid-cols gap-6">
        {/* <Card className={isDarkMode ? "bg-slate-800 border-slate-700" : ""}>
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 ${
                isDarkMode ? "text-white" : ""
              }`}
            >
              {currentAlgorithm.name}
              <Badge
                variant={
                  currentAlgorithm.type === "sorting" ? "default" : "secondary"
                }
              >
                {currentAlgorithm.type}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Time Complexity</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Best Case:</span>
                  <Badge variant="outline">
                    {currentAlgorithm.timeComplexity.best}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Average Case:</span>
                  <Badge variant="outline">
                    {currentAlgorithm.timeComplexity.average}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Worst Case:</span>
                  <Badge variant="outline">
                    {currentAlgorithm.timeComplexity.worst}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Space Complexity</h4>
              <Badge variant="outline">
                {currentAlgorithm.spaceComplexity}
              </Badge>
            </div>
          </CardContent>
        </Card> */}

        <Card
          className={`w-full ${
            isDarkMode ? "bg-slate-800 border-slate-700" : ""
          }`}
        >
          <CardHeader>
            <CardTitle className={isDarkMode ? "text-white" : ""}>
              Fun Fact! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 leading-relaxed">
              {currentAlgorithm.funFact}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Algorithm Comparison Table */}
      <Card className={isDarkMode ? "bg-slate-800 border-slate-700" : ""}>
        <CardHeader>
          <CardTitle className={isDarkMode ? "text-white" : ""}>
            Algorithm Comparison
          </CardTitle>
          <CardDescription className={isDarkMode ? "text-slate-300" : ""}>
            Compare time and space complexities of different algorithms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table
              className={`w-full text-sm ${isDarkMode ? "text-slate-200" : ""}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-slate-600" : ""}`}
                >
                  <th className="text-left p-2">Algorithm</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Best</th>
                  <th className="text-left p-2">Average</th>
                  <th className="text-left p-2">Worst</th>
                  <th className="text-left p-2">Space</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(algorithms).map(([key, algo]) => (
                  <tr
                    key={key}
                    className={`border-b transition-colors ${
                      isDarkMode
                        ? `border-slate-600 hover:bg-slate-700 ${
                            selectedAlgorithm === key ? "bg-slate-700" : ""
                          }`
                        : `hover:bg-slate-50 ${
                            selectedAlgorithm === key ? "bg-blue-50" : ""
                          }`
                    }`}
                  >
                    <td className="p-2 font-medium">{algo.name}</td>
                    <td className="p-2">
                      <Badge
                        variant={
                          algo.type === "sorting" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {algo.type}
                      </Badge>
                    </td>
                    <td className="p-2">{algo.timeComplexity.best}</td>
                    <td className="p-2">{algo.timeComplexity.average}</td>
                    <td className="p-2">{algo.timeComplexity.worst}</td>
                    <td className="p-2">{algo.spaceComplexity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
