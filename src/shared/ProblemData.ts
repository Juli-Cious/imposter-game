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
        name: "Calculator.py",
        language: "python",
        description: "Fix the syntax error and print the sum of a + b.",
        content: `def add(a, b):\n    return a + b\n\na = 5\nb = 10\n# TODO: Call the function and print the result\n`,
        expectedOutput: "15",
        testStatus: "PENDING"
    },
    "file_loop": {
        name: "Looper.js",
        language: "javascript",
        description: "Write a loop that prints numbers 0 to 4 (each on a new line).",
        content: `// Write your for-loop here\n\n`,
        expectedOutput: "0\n1\n2\n3\n4",
        testStatus: "PENDING"
    },
    "file_cpp_hello": {
        name: "Main.cpp",
        language: "cpp",
        description: "Print 'Hello World' to the console.",
        content: `#include <iostream>\n\nint main() {\n    // Print here\n    return 0;\n}`,
        expectedOutput: "Hello World",
        testStatus: "PENDING"
    }
};