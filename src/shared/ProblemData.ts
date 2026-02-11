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
        name: "OceanCleanup.py",
        language: "python",
        description: "Write a loop to activate the cleanup bot 5 times to remove plastic from the beach.",
        content: `# MISSION: Clean the coast!
# The 'clean()' function removes one piece of trash.
# TODO: Write a for-loop to run clean() 5 times automatically!

def clean():
    print("Trash removed")

# Write your loop below:
`,
        expectedOutput: "Trash removed\nTrash removed\nTrash removed\nTrash removed\nTrash removed",
        testStatus: "PENDING"
    },
    "file_loop": {
        name: "SolarPanel.js",
        language: "javascript",
        description: "Align the solar panels to maximize efficiency. Use a loop to adjust angles from 0 to 40 in steps of 10.",
        content: `// MISSION: Optimize Solar Energy
// We need to test angles: 0, 10, 20, 30, 40
// TODO: Write a for-loop to print these angles

`,
        expectedOutput: "0\n10\n20\n30\n40",
        testStatus: "PENDING"
    },
    "file_cpp_hello": {
        name: "RecyclerArgs.cpp",
        language: "cpp",
        description: "Print 'System Online' to start the recycling plant main control loop.",
        content: `#include <iostream>

int main() {
    // MISSION: Start the Recycling Plant
    // TODO: Print "System Online" to the console
    
    return 0;
}`,
        expectedOutput: "System Online",
        testStatus: "PENDING"
    }
};