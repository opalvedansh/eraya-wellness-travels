#!/bin/bash

# OTP Authentication System - Quick Testing Script
# Usage: bash QUICK_TEST.sh

set -e

BASE_URL="http://localhost:8080"
TEST_EMAIL="test-$(date +%s)@example.com"

echo "================================================"
echo "OTP Authentication System - Quick Test"
echo "================================================"
echo ""
echo "Test Email: $TEST_EMAIL"
echo "Base URL: $BASE_URL"
echo ""

# Step 1: Request OTP
echo "📧 Step 1: Requesting OTP..."
echo "------"
REQUEST_RESPONSE=$(curl -s -X POST "$BASE_URL/api/request-otp" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\"}")

echo "$REQUEST_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REQUEST_RESPONSE"
echo ""

# Extract OTP from console output (for testing)
echo "⚠️  IMPORTANT: Check the server console for the OTP code"
echo "   Look for: '📧 OTP VERIFICATION CODE'"
echo ""
read -p "Enter the OTP code from console: " OTP_CODE

echo ""
echo "🔐 Step 2: Verifying OTP..."
echo "------"
VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/verify-otp" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"otp\":\"$OTP_CODE\"}")

echo "$VERIFY_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$VERIFY_RESPONSE"
echo ""

# Check if verification was successful
if echo "$VERIFY_RESPONSE" | grep -q '"success":true'; then
  echo "✅ Verification successful!"
  echo ""
  
  # Extract and display token
  TOKEN=$(echo "$VERIFY_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  echo "📌 Auth Token: $TOKEN"
  echo ""
else
  echo "❌ Verification failed - check OTP code"
  exit 1
fi

echo "================================================"
echo "✨ Test Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Frontend can use the token for authenticated requests"
echo "2. User is now verified in database (isVerified: true)"
echo "3. Request new OTP for different email to test again"
