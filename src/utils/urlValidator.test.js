/**
 * Manual Test Suite for URL Validator
 * Run these tests manually in browser console or create a test page
 */

import { validateReturnUrl } from './urlValidator';

// Test cases for URL validation
export const runUrlValidatorTests = () => {
  console.log('🧪 Starting URL Validator Tests...\n');

  const tests = [
    // Valid URLs
    {
      name: 'Valid HTTPS URL - same domain',
      input: 'https://td.reversebits.com/dashboard',
      expected: 'https://td.reversebits.com/dashboard',
      shouldPass: true
    },
    {
      name: 'Valid HTTP URL - localhost',
      input: 'http://localhost:3000/app',
      expected: 'http://localhost:3000/app',
      shouldPass: true
    },
    {
      name: 'Valid subdomain',
      input: 'https://app.reversebits.com/home',
      expected: 'https://app.reversebits.com/home',
      shouldPass: true
    },
    {
      name: 'Valid relative URL',
      input: '/dashboard',
      expected: '/dashboard',
      shouldPass: true
    },
    {
      name: 'Valid relative URL with query params',
      input: '/success?token=abc123',
      expected: '/success?token=abc123',
      shouldPass: true
    },

    // Invalid URLs - Dangerous Protocols
    {
      name: 'Blocked javascript: protocol',
      input: 'javascript:alert("XSS")',
      expected: 'https://td.reversebits.com',
      shouldPass: false
    },
    {
      name: 'Blocked data: protocol',
      input: 'data:text/html,<script>alert("XSS")</script>',
      expected: 'https://td.reversebits.com',
      shouldPass: false
    },
    {
      name: 'Blocked vbscript: protocol',
      input: 'vbscript:msgbox("XSS")',
      expected: 'https://td.reversebits.com',
      shouldPass: false
    },
    {
      name: 'Blocked file: protocol',
      input: 'file:///etc/passwd',
      expected: 'https://td.reversebits.com',
      shouldPass: false
    },

    // Invalid URLs - Untrusted Domains
    {
      name: 'Blocked untrusted domain',
      input: 'https://evil.com/phishing',
      expected: 'https://td.reversebits.com',
      shouldPass: false
    },
    {
      name: 'Blocked similar looking domain',
      input: 'https://reversebits.co/fake',
      expected: 'https://td.reversebits.com',
      shouldPass: false
    },

    // Edge Cases
    {
      name: 'Empty string',
      input: '',
      expected: 'https://td.reversebits.com',
      shouldPass: false
    },
    {
      name: 'Null value',
      input: null,
      expected: 'https://td.reversebits.com',
      shouldPass: false
    },
    {
      name: 'Undefined value',
      input: undefined,
      expected: 'https://td.reversebits.com',
      shouldPass: false
    },
    {
      name: 'Whitespace only',
      input: '   ',
      expected: 'https://td.reversebits.com',
      shouldPass: false
    },
    {
      name: 'Malformed URL',
      input: 'not a valid url at all',
      expected: 'https://td.reversebits.com',
      shouldPass: false
    },

    // Protocol Bypass Attempts
    {
      name: 'JavaScript with whitespace',
      input: 'java script:alert(1)',
      expected: 'https://td.reversebits.com',
      shouldPass: false
    },
    {
      name: 'Mixed case javascript',
      input: 'JaVaScRiPt:alert(1)',
      expected: 'https://td.reversebits.com',
      shouldPass: false
    },

    // Open Redirect Attempts
    {
      name: 'URL with @ symbol redirect attempt',
      input: 'https://td.reversebits.com@evil.com/steal',
      expected: 'https://td.reversebits.com',
      shouldPass: false
    },
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach((test, index) => {
    const result = validateReturnUrl(test.input, 'https://td.reversebits.com');
    const success = result === test.expected;

    if (success) {
      passed++;
      console.log(`✅ Test ${index + 1}: ${test.name}`);
      console.log(`   Input: ${test.input}`);
      console.log(`   Output: ${result}\n`);
    } else {
      failed++;
      console.error(`❌ Test ${index + 1}: ${test.name}`);
      console.error(`   Input: ${test.input}`);
      console.error(`   Expected: ${test.expected}`);
      console.error(`   Got: ${result}\n`);
    }
  });

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${tests.length} total\n`);

  if (failed === 0) {
    console.log('🎉 All tests passed!');
  } else {
    console.error('⚠️ Some tests failed. Please review the failures above.');
  }

  return { passed, failed, total: tests.length };
};

// Export for manual testing
export default runUrlValidatorTests;
