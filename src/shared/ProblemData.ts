export interface CodingChallenge {
    name: string;
    language: 'python' | 'javascript' | 'cpp';
    description: string;
    content: string; // The "Starter Code"
    expectedOutput: string; // What the console must print to pass
    testStatus: 'PENDING' | 'PASS' | 'FAIL';
}

export const LEVEL_1_PROBLEMS: Record<string, CodingChallenge> = {
    "file_sum": {
        name: "SolarOptimizer.py",
        language: "python",
        description: "Calculate the total energy output of two solar arrays (a + b).",
        content: `def get_total_output(array_a, array_b):\n    return array_a + array_b\n\narray_a = 5\narray_b = 10\n# TODO: Calculate the total energy output of two solar arrays (a + b).\n# Print the result.\n`,
        expectedOutput: "15",
        testStatus: "PASS"
    },
    "file_loop": {
        name: "RecycleSorter.js",
        language: "javascript",
        description: "Program a robotic arm to sort 5 batches of recycled materials (indices 0 to 4).",
        content: `// TODO: Program a robotic arm to sort 5 batches of recycled materials (indices 0 to 4).\n// Write a loop that prints indices 0 to 4.\n`,
        expectedOutput: "0\n1\n2\n3\n4",
        testStatus: "PASS"
    },
    "file_cpp_hello": {
        name: "O2Scrubber.cpp",
        language: "cpp",
        description: "Initialize the atmospheric scrubbers by printing the activation code.",
        content: `#include <iostream>\n\nint main() {\n    // TODO: Initialize the atmospheric scrubbers by printing the activation code: "Oxy-System: ACTIVE"\n    return 0;\n}`,
        expectedOutput: "Oxy-System: ACTIVE",
        testStatus: "FAIL"
    }
};