import { LEVEL_1_PROBLEMS } from '../../shared/ProblemData';

// This mimics a CI/CD Pipeline
export const runSystemTests = (files: Record<string, { testStatus: string }>) => {
    const logs: string[] = [];
    let success = true;

    Object.entries(LEVEL_1_PROBLEMS).forEach(([key, problem]) => {
        const file = files[key];
        if (file && file.testStatus === 'PASS') {
            logs.push(`✅ ${problem.name}: PASSED`);
        } else {
            logs.push(`❌ ${problem.name}: FAILED (Status: ${file?.testStatus || 'MISSING'})`);
            success = false;
        }
    });

    return { success, logs };
};