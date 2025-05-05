
import '@testing-library/jest-dom';
import { expect } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';

// Add the jest-dom matchers to vitest
expect.extend(matchers);

// Add any global setup for tests here
